package com.bhs.sssss.controllers;

import com.bhs.sssss.entities.CartEntity;
import com.bhs.sssss.entities.ItemEntity;
import com.bhs.sssss.entities.MemberEntity;
import com.bhs.sssss.services.CartService;
import com.bhs.sssss.services.ItemService;
import com.bhs.sssss.services.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {
    private final ItemService itemService;

    @Autowired
    public HomeController(ItemService itemService) {
        this.itemService = itemService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String getIndex() {
        return "redirect:/main";
    }

    @RequestMapping(value = "/main", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getMain(@SessionAttribute(value = "member", required = false)MemberEntity member) {
        ItemEntity[] items = this.itemService.getItems();
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("items", items);
        modelAndView.addObject("member", member);
        modelAndView.setViewName("main/index");
        return modelAndView;
    }

    @RequestMapping(value = "/market-benefit", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getMarketBenefit(@SessionAttribute(value = "member", required = false)MemberEntity member) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("member", member);
        modelAndView.setViewName("market-benefit/market-benefit");
        return modelAndView;
    }





}
