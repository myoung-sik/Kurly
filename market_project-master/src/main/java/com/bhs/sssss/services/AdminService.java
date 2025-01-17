package com.bhs.sssss.services;

import com.bhs.sssss.entities.ItemEntity;
import com.bhs.sssss.entities.MemberEntity;
import com.bhs.sssss.exceptions.TransactionalException;
import com.bhs.sssss.mappers.MemberMapper;
import com.bhs.sssss.results.CommonResult;
import com.bhs.sssss.results.Result;
import com.bhs.sssss.vos.MemberPageVo;
import com.bhs.sssss.vos.PageVo;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Console;
import java.time.LocalDateTime;

@Service
public class AdminService {
    private final MemberMapper memberMapper;

    @Autowired
    public AdminService(MemberMapper memberMapper) {
        this.memberMapper = memberMapper;
    }

    public Result passwordCheck(MemberEntity member, String password){
        if(member == null || password == null || password.length() < 10 || password.length() > 16 || !member.isAdmin()) {
            System.out.println(member);
            System.out.println(password);
            System.out.println(member.isAdmin());
            return CommonResult.FAILURE;
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if(!BCrypt.checkpw(password, member.getPassword())) {
            return CommonResult.FAILURE;
        }
        return CommonResult.SUCCESS;
    }

    public Pair<MemberPageVo, MemberEntity[]> getMembers(int page){
        page = Math.max(1, page);
        int totalCount = this.memberMapper.selectMembersCount();
        MemberPageVo memberPageVo = new MemberPageVo(page, totalCount);
        MemberEntity[] members = this.memberMapper.selectMembers(
                memberPageVo.countPerPage,
                memberPageVo.offsetCount
        );
        return Pair.of(memberPageVo, members);
    }

    public Pair<MemberPageVo, MemberEntity[]> getMembersBySearch(int page, String keyword){
        page = Math.max(1, page);
        if(keyword == null) {
            keyword = "";
        }
        int totalCount = this.memberMapper.selectMembersCountBySearch(keyword);
        MemberPageVo memberPageVo = new MemberPageVo(page, totalCount);
        MemberEntity[] members = this.memberMapper.selectMembersBySearch(
                keyword,
                memberPageVo.countPerPage,
                memberPageVo.offsetCount
        );
        return Pair.of(memberPageVo, members);
    }

    public MemberEntity getMemberById(String id){
        return this.memberMapper.selectUserByIdIncludeDeleted(id);
    }

    @Transactional
    public Result modifySuspended(String id, String isSuspended){
        if(id == null || isSuspended == null) {
            return CommonResult.FAILURE;
        }

        MemberEntity member = this.memberMapper.selectUserById(id);

        member.setSuspended(Boolean.parseBoolean(isSuspended));
        member.setUpdatedAt(LocalDateTime.now());

        if(this.memberMapper.updateMember(member) == 0) {
            throw new TransactionalException();
        }

        return CommonResult.SUCCESS;
    }
}
