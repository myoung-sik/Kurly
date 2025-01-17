package com.bhs.sssss.controllers;

import com.bhs.sssss.entities.MemberEntity;
import com.bhs.sssss.results.Result;
import com.bhs.sssss.services.AdminService;
import com.bhs.sssss.vos.MemberPageVo;
import org.apache.commons.lang3.tuple.Pair;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;

@Controller
@RequestMapping(value = "/admin")
public class AdminController {
    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }


    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getAdmin(@SessionAttribute(value = "member", required = false) MemberEntity member) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("member", member);
        modelAndView.setViewName("admin/admin");
        return modelAndView;
    }

    @RequestMapping(value = "/member-management", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getMemberManagement(@SessionAttribute(value = "member", required = false) MemberEntity member,
                                            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                            @RequestParam(value = "keyword", required = false) String keyword) {
        ModelAndView modelAndView = new ModelAndView();
        if(keyword == null){
            Pair<MemberPageVo, MemberEntity[]> pair = this.adminService.getMembers(page);
            modelAndView.addObject("pageVo", pair.getLeft());
            modelAndView.addObject("members", pair.getRight());
        } else {
            Pair<MemberPageVo, MemberEntity[]> pair = this.adminService.getMembersBySearch(page, keyword);
            modelAndView.addObject("pageVo", pair.getLeft());
            modelAndView.addObject("members", pair.getRight());
            modelAndView.addObject("keyword", keyword);
        }

        modelAndView.addObject("member", member);
        modelAndView.setViewName("admin/member-management");
        return modelAndView;
    }

    @RequestMapping(value = "/member-detail", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getMemberDetail(@SessionAttribute(value = "member", required = false) MemberEntity member,
                                        @RequestParam(value = "id", required = false) String id) {
        MemberEntity user = this.adminService.getMemberById(id);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("user", user);
        modelAndView.addObject("member", member);
        modelAndView.setViewName("admin/member-detail");
        return modelAndView;
    }

    @RequestMapping(value = "/password-check", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postPasswordCheck(@SessionAttribute(value = "member", required = false) MemberEntity member,
                                   @RequestParam(value = "password", required = false) String password) {
        Result result = this.adminService.passwordCheck(member, password);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/modify-suspended", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchModifySuspended(@RequestParam(value = "id", required = false) String id,
                                       @RequestParam(value = "isSuspended", required = false) String isSuspended) {
        Result result = this.adminService.modifySuspended(id, isSuspended);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }
}
