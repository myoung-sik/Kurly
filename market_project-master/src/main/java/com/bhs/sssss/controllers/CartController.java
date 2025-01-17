package com.bhs.sssss.controllers;

import com.bhs.sssss.entities.CartEntity;
import com.bhs.sssss.entities.ItemEntity;
import com.bhs.sssss.entities.MemberEntity;
import com.bhs.sssss.results.CommonResult;
import com.bhs.sssss.results.Result;
import com.bhs.sssss.services.CartService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping(value = "/cart")
public class CartController {
    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @RequestMapping(value = "/in", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getCartIndex(@SessionAttribute(value = "member", required = false) MemberEntity member) {
        ModelAndView mav = new ModelAndView();
        // 로그인 상태가 아닐 때
        if (member == null) {
            mav.addObject("items", null);
            mav.addObject("message", "장바구니에 담긴 상품이 없습니다.");
            mav.setViewName("cart/cart-in");
            return mav;
        }
        // 장바구니 아이템 조회
        List<CartEntity> items = this.cartService.getCartsByMemberId(member.getId());
        boolean hasUncheckedItems = items.stream().anyMatch(item -> item.getIsChecked() == 0);
        mav.addObject("member", member);
        mav.addObject("items", items);
        mav.addObject("hasUncheckedItems", hasUncheckedItems);

        mav.setViewName("cart/cart-in");
        return mav;
    }

    @RequestMapping(value = "/in", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String PostCartIndex(@SessionAttribute(value = "member", required = false) MemberEntity member,
                                @RequestParam(value = "quantity", required = false) int quantity,
                                @RequestParam(value = "itemId", required = false) String itemId) {

        Result result = this.cartService.postCart(member, quantity, itemId);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    // 수량 증가 , 감소
    @RequestMapping(value = "/plus", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postCartPlus(@RequestParam(value = "itemQuantity", required = false) int quantity,
                               @RequestParam(value = "index", required = false) int index,
                               CartEntity cart) throws IllegalArgumentException {
        JSONObject response = new JSONObject();
        int result = this.cartService.plus(cart, quantity, index);

        response.put("result", result);
        return response.toString();
    }
    @RequestMapping(value = "/minus", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postCartMinus(@RequestParam(value = "itemQuantity", required = false) int quantity,
                                @RequestParam(value = "index", required = false) int index) throws IllegalArgumentException {
        JSONObject response = new JSONObject();

        try {
            int result = this.cartService.minus(quantity, index);
            response.put("result", result);

        } catch (IllegalArgumentException e) {
            response.put("error", e.getMessage());
        }

        return response.toString();
    }


    @RequestMapping(value = "/updateCheck", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String updateCheck(@RequestParam(value = "index", required = false) Integer index,
                              @RequestParam(value = "isChecked", required = false) Integer isChecked) {
        JSONObject response = new JSONObject();
        if (index == null || isChecked == null) {
            return response.toString();
        }
        this.cartService.updateCheckStatus(index, isChecked);
        response.put("result", "success");
        return response.toString();
    }
    // 상품 전체 가격(체크된 항목만)
    @RequestMapping(value = "/totalPrice", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String calculateTotalPrice( @RequestParam(value = "index", required = false) List<Integer> index,
                                       @RequestParam(value = "itemPrice", required = false) List<Integer> itemPrices) {
        JSONObject response = new JSONObject();
        if (index == null || itemPrices == null || index.isEmpty() || itemPrices.isEmpty()) {
            response.put("totalPrice", 0);
            return response.toString();
        }

        try {

            if (index.size() != itemPrices.size()) {
                response.put("error", "입력크기가 일치하지 않습니다");
                return response.toString();
            }
            int totalPrice = this.cartService.calculateTotalPrice(index, itemPrices);
            response.put("totalPrice", totalPrice);
        }catch (NumberFormatException e) {
            response.put("error","잘못된 숫자 형식입니다.");
        }
        return response.toString();
    }
    // 상품삭제
    @RequestMapping(value = "/deleteItem", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String deleteItem(@RequestParam(value = "index", required = true) Integer index) {
        JSONObject response = new JSONObject();
        if (index == null) {
            response.put("error", "잘못된 index 입니다");
            return response.toString();
        }
        this.cartService.deleteItem(index);
        response.put("result", "success");
        return response.toString();
    }
    // 상품 선택 삭제
    @RequestMapping(value = "/deleteSelectedItems", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String deleteSelectedItems(@RequestParam("indices") List<Integer> indices) {
        JSONObject response = new JSONObject();
        if (indices == null || indices.isEmpty()) {
            response.put("error", "삭제할 항목이 선택되지 않았습니다");
            return response.toString();
        }
        this.cartService.deleteSelectedItems(indices);
        response.put("result", "success");
        return response.toString();
    }

    // 전체 선택 체크박스와 샛별배송 체크박스 상황 분석
    @RequestMapping(value = "/getCheckboxStatus", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getCheckboxStatus() {
        JSONObject response = new JSONObject();
        List<CartEntity> items = this.cartService.getAllCarts(); // 전체 선택 상태 확인
        boolean isAllChecked = items.stream().allMatch(item -> item.getIsChecked() == 1);

        // 샛별배송 체크박스 상태 설정
        boolean isDeliveryChecked = items.stream().allMatch(item -> item.getIsChecked() == 1);

        // 개별 체크박스 상태를 index 기준으로 반환
        Map<Integer, Boolean> checkboxStatus = items.stream()
                .collect(Collectors.toMap(CartEntity::getIndex, item -> item.getIsChecked() == 1));


        response.put("isAllChecked", isAllChecked);
        response.put("isDeliveryChecked", isDeliveryChecked);
        response.put("checkboxStatus", checkboxStatus);

        return response.toString();
    }

    // 장바구니에서 결제주문서로 넘어가기 위한 메서드(item이  있는지, 체크된 item이 있는지)
    @RequestMapping(value = "/getCartStatus", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getCartStatus(@SessionAttribute(value = "member", required = false) MemberEntity member) {
        JSONObject response = new JSONObject();
        boolean hasItems = this.cartService.hasActiveItems(member);
        boolean hasCheckedItems = this.cartService.hasCheckedItems(member);
        response.put("hasItems", hasItems);
        response.put("hasCheckedItems", hasCheckedItems);
        return response.toString();
    }

}
