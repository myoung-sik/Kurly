package com.bhs.sssss.controllers;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/address")
public class AddressController {

    @RequestMapping(value = "/shipping-address", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getShippingAddress() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("address/shipping-address");
        return modelAndView;
    }
}
