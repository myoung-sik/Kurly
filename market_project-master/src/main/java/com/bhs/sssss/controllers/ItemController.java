package com.bhs.sssss.controllers;

import com.bhs.sssss.services.ItemService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/item")
public class ItemController {
    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @RequestMapping(value = "/categories", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getAllCategories() {
        JSONObject response = new JSONObject();
        if(this.itemService.getCategories() != null) {
            response.put("categories", this.itemService.getCategories());
        } else {
            response.put("result", "failure");
        }
        return response.toString();
    }

    @RequestMapping(value = "/sub-categories", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getSubCategories(@RequestParam(value = "categoryId", required = false) String categoryId ) {
        JSONObject response = new JSONObject();
        if(this.itemService.getCategories() != null) {
            response.put("subCategories", this.itemService.getSubCategoriesById(categoryId));
        } else {
            response.put("result", "failure");
        }
        return response.toString();
    }
}
