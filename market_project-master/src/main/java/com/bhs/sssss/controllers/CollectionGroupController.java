package com.bhs.sssss.controllers;

import com.bhs.sssss.entities.ItemEntity;
import com.bhs.sssss.entities.MemberEntity;
import com.bhs.sssss.services.ItemService;
import com.bhs.sssss.vos.ItemPageVo;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/collection-groups")
public class CollectionGroupController {
    private final ItemService itemService;

    @Autowired
    public CollectionGroupController(ItemService itemService) {
        this.itemService = itemService;
    }


    @RequestMapping(value = "/market-best", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getMarketBest(@SessionAttribute(value = "member", required = false) MemberEntity member,
                                      @RequestParam(value = "page", required = false, defaultValue = "1") int page) {
        Pair<ItemPageVo, ItemEntity[]> pair = this.itemService.getItemsBySticker(page);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("pageVo", pair.getLeft());
        modelAndView.addObject("items", pair.getRight());
        modelAndView.addObject("member", member);
        modelAndView.setViewName("collection-groups/market-best");
        return modelAndView;
    }


    @RequestMapping(value = "/market-newproduct", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getMarketNewProduct(@SessionAttribute(value = "member", required = false) MemberEntity member,
                                      @RequestParam(value = "page", required = false, defaultValue = "1") int page) {
        Pair<ItemPageVo, ItemEntity[]> pair = this.itemService.getItemsByNew(page);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("pageVo", pair.getLeft());
        modelAndView.addObject("items", pair.getRight());
        modelAndView.addObject("member", member);
        modelAndView.setViewName("collection-groups/market-newproduct");
        return modelAndView;
    }

    @RequestMapping(value = "/market-sales", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getMarketSales(@SessionAttribute(value = "member", required = false) MemberEntity member,
                                            @RequestParam(value = "page", required = false, defaultValue = "1") int page) {
        Pair<ItemPageVo, ItemEntity[]> pair = this.itemService.getItemsByDiscount(page);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("pageVo", pair.getLeft());
        modelAndView.addObject("items", pair.getRight());
        modelAndView.addObject("member", member);
        modelAndView.setViewName("collection-groups/market-sales");
        return modelAndView;
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getSearch(@SessionAttribute(value = "member", required = false) MemberEntity member,
                                  @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                  @RequestParam(value = "keyword", required = false) String keyword) {
        Pair<ItemPageVo, ItemEntity[]> pair = this.itemService.getItemsByKeyword(page, keyword);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("pageVo", pair.getLeft());
        modelAndView.addObject("items", pair.getRight());
        modelAndView.addObject("member", member);
        modelAndView.setViewName("collection-groups/search");
        return modelAndView;
    }

}
