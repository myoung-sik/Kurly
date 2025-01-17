package com.bhs.sssss.interceptors;

import com.bhs.sssss.entities.MemberEntity;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class SessionInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("SessionInterceptor.preHandle 실행 됨1");
        HttpSession session = request.getSession();
        Object memberObj = session.getAttribute("member");
        if(memberObj == null || !(memberObj instanceof MemberEntity)) {
            response.setStatus(404);
            return false;
        }
        MemberEntity member = (MemberEntity) memberObj;
        if(!member.isAdmin()){
            response.setStatus(404);
            return false;
        }
        return true;
    }
}
