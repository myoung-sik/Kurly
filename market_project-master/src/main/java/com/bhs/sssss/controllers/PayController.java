package com.bhs.sssss.controllers;


import com.bhs.sssss.entities.CartEntity;
import com.bhs.sssss.entities.MemberEntity;
import com.bhs.sssss.entities.PayLoadEntity;
import com.bhs.sssss.services.PayService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Controller
@RequestMapping(value = "/pay")
public class PayController {
    private final PayService payService;

    @Autowired
    public PayController(PayService payService) {
        this.payService = payService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView getPayIndex(@SessionAttribute(value = "member", required = false) MemberEntity member) {
        ModelAndView mav = new ModelAndView();
        List<CartEntity> items = this.payService.getAllPay(member);
        mav.addObject("items", items);
        mav.addObject("member", member);
        mav.setViewName("pay/pay");
        return mav;
    }


    @RequestMapping(value = "/submit", method = RequestMethod.POST,consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public String submitPayment(@RequestParam Map<String, String> formData,
                                @SessionAttribute(value = "member", required = false) MemberEntity member) {
        // 데이터 파싱
        List<PayLoadEntity> payLoad = new ArrayList<>();
        String totalPriceString = formData.get("totalPrice");
        if (totalPriceString == null || totalPriceString.isEmpty()) {
            throw new IllegalArgumentException("totalPrice 값이 없습니다.");
        }
        int totalPrice = Integer.parseInt(totalPriceString);

        // items 파싱
        int index = 0;
        while (formData.containsKey(String.format("items[%d].payItemId", index))) {
            PayLoadEntity item = new PayLoadEntity();
            item.setPayItemId(Integer.parseInt(formData.get(String.format("items[%d].payItemId", index))));
            item.setPayItemName(formData.get(String.format("items[%d].payItemName", index)));
            item.setPayItemPrice(formData.get(String.format("items[%d].payItemPrice", index)));
            item.setPayQuantity(formData.get(String.format("items[%d].payQuantity", index)));
            item.setItemImage(formData.get(String.format("items[%d].itemImage", index)));
            payLoad.add(item);
            index++;
        }

        boolean isValid = this.payService.processPayment(payLoad, totalPrice, member);

        JSONObject response = new JSONObject();
        if (!isValid) {
            response.put("status", "fail");
            response.put("message", "결제에 실패했습니다.");
        } else {
            response.put("status", "success");
            response.put("message", "결제가 완료되었습니다.");
        }
        return response.toString();
    }


}