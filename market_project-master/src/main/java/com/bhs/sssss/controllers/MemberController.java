package com.bhs.sssss.controllers;

import com.bhs.sssss.entities.EmailTokenEntity;
import com.bhs.sssss.entities.MemberEntity;
import com.bhs.sssss.results.CommonResult;
import com.bhs.sssss.results.Result;
import com.bhs.sssss.services.CartService;
import com.bhs.sssss.services.MemberService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;


@Controller
@RequestMapping(value = "/member")
public class MemberController {
    private final MemberService memberService;
    private final CartService cartService;

    @Autowired
    public MemberController(MemberService memberService, CartService cartService) {
        this.memberService = memberService;
        this.cartService = cartService;
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getLogin() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("member/login");
        return modelAndView;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postLogin(HttpServletRequest request, MemberEntity member) {
        HttpSession session = request.getSession();
        Result result = this.memberService.login(member);
        if(result == CommonResult.SUCCESS){
            session.setAttribute("member", member);
        }
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/signup", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getSignup() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("member/signup");
        return modelAndView;
    }

    @RequestMapping(value = "/signup", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postSignup(MemberEntity member) {
        Result result = this.memberService.signup(member);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public ModelAndView getLogout(HttpSession session) {
        session.setAttribute("member", null);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("redirect:/main");
        return modelAndView;
    }

    @RequestMapping(value = "/duplication-check", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String duplicationCheck(@RequestParam(value = "contact", required = false) String contact,
                                   @RequestParam(value = "memberId", required = false) String memberId,
                                   @RequestParam(value = "email", required = false) String email) {
        JSONObject response = new JSONObject();
        Result result = this.memberService.duplicationCheck(contact, memberId, email);
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }


    @RequestMapping(value = "/validate-email", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postValidateEmailToken(HttpServletRequest request,
                                        @RequestParam(value = "email") String email) throws MessagingException {
        Result result = this.memberService.validateEmailToken(request, email);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/validate-email-token", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getValidateEmailToken(EmailTokenEntity emailToken) {
        Result result = this.memberService.getValidateEmailToken(emailToken);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject(Result.NAME, result.nameToLower());
        modelAndView.setViewName("member/validateEmailToken");
        return modelAndView;
    }

    @RequestMapping(value = "find", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getFind(@RequestParam(value = "type")String type) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("type", type);
        modelAndView.setViewName("member/find");
        return modelAndView;
    }

    @RequestMapping(value = "/recover-id", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getRecoverId(@RequestParam(value = "userName", required = false) String userName,
                               @RequestParam(value = "email", required = false) String email) {
        String id = this.memberService.getRecoverId(userName, email);
        JSONObject response = new JSONObject();
        if(id.equals("failure")){
            response.put("result", "failure");
        } else {
            response.put("result", "success");
            response.put("id", id);
        }
        return response.toString();
    }

    @RequestMapping(value = "/recover-password", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getRecoverPassword(@RequestParam(value = "userEmail", required = false) String userEmail,
                                           @RequestParam(value = "key", required = false) String key) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("userEmail", userEmail);
        modelAndView.addObject("key", key);
        modelAndView.setViewName("member/recoverPassword");
        return modelAndView;
    }

    @RequestMapping(value = "/recover-password", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRecoverPassword(HttpServletRequest request,
                                      @RequestParam(value = "memberId", required = false) String id,
                                      @RequestParam(value = "email", required = false) String email) throws MessagingException {
        Result result = this.memberService.provokeRecoverPassword(request, id, email);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/recover-password", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchRecoverPassword(EmailTokenEntity emailToken,
                                       @RequestParam(value = "password", required = false) String password){
        Result result = this.memberService.resolveRecoverPassword(emailToken, password);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        response.put("name", this.memberService.selectMemberByEmail(emailToken.getUserEmail()).getUserName());
        return response.toString();
    }

}
