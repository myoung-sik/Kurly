package com.bhs.sssss.services;

import com.bhs.sssss.entities.EmailTokenEntity;
import com.bhs.sssss.entities.MemberEntity;
import com.bhs.sssss.exceptions.TransactionalException;
import com.bhs.sssss.mappers.EmailTokenMapper;
import com.bhs.sssss.mappers.MemberMapper;
import com.bhs.sssss.results.CommonResult;
import com.bhs.sssss.results.Result;
import com.bhs.sssss.results.member.LoginResult;
import com.bhs.sssss.results.member.ResolveRecoverPasswordResult;
import com.bhs.sssss.results.member.SignupResult;
import com.bhs.sssss.results.member.ValidateEmailTokenResult;
import com.bhs.sssss.utils.CryptoUtils;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.LocalDateTime;

@Slf4j
@Service
public class MemberService {
    private final MemberMapper memberMapper;
    private final EmailTokenMapper emailTokenMapper;
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Autowired
    public MemberService(MemberMapper memberMapper, EmailTokenMapper emailTokenMapper, JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.memberMapper = memberMapper;
        this.emailTokenMapper = emailTokenMapper;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public String getRecoverId(String userName, String email){
        if(userName == null || email == null){
            return "failure";
        }
        MemberEntity member = this.memberMapper.selectUserByNameAndEmail(userName, email);
        return member.getId();
    }

    public MemberEntity selectMemberByEmail(String userEmail) {
        return this.memberMapper.selectUserByEmail(userEmail);
    }

    public Result duplicationCheck(String contact, String memberId, String email) {
        if (this.memberMapper.selectUserByContact(contact) != null) {
            return SignupResult.FAILURE_DUPLICATE_CONTACT;
        }

        if (this.memberMapper.selectUserById(memberId) != null) {
            return SignupResult.FAILURE_DUPLICATE_ID;
        }

        if (this.memberMapper.selectUserByEmail(email) != null) {
            return SignupResult.FAILURE_DUPLICATE_EMAIL;
        }

        return CommonResult.SUCCESS;
    }


    public Result login(MemberEntity member) {
        if(member == null ||
           member.getId() == null || member.getId().length() < 6 || member.getId().length() > 16 ||
           member.getPassword() == null || member.getPassword().length() < 10 || member.getPassword().length() > 16 ) {
            return CommonResult.FAILURE;
        }
        MemberEntity dbMember = memberMapper.selectUserById(member.getId());
        if(dbMember == null || dbMember.getDeletedAt() != null) {
            return CommonResult.FAILURE;
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if(!encoder.matches(member.getPassword(), dbMember.getPassword())) {
            return CommonResult.FAILURE;
        }
        if(!dbMember.isVerified()){
            return LoginResult.FAILURE_NOT_VERIFIED;
        }
        if(dbMember.isSuspended()){
            return LoginResult.FAILURE_SUSPENDED;
        }
        member.setPassword(dbMember.getPassword());
        member.setUserName(dbMember.getUserName());
        member.setEmail(dbMember.getEmail());
        member.setContact(dbMember.getContact());
        member.setAddress(dbMember.getAddress());
        member.setGender(dbMember.getGender());
        member.setBirth(dbMember.getBirth());
        member.setCreatedAt(dbMember.getCreatedAt());
        member.setUpdatedAt(dbMember.getUpdatedAt());
        member.setDeletedAt(dbMember.getDeletedAt());
        member.setAdmin(dbMember.isAdmin());
        member.setSuspended(dbMember.isSuspended());
        member.setVerified(dbMember.isVerified());

        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result signup(MemberEntity member) {
        if (member == null ||
            member.getId() == null || member.getId().length() < 6 || member.getId().length() > 16 ||
            member.getEmail() == null || member.getEmail().length() < 8  || member.getEmail().length() > 50 ||
            member.getPassword() == null || member.getPassword().length() < 10 || member.getPassword().length() > 16 ||
            member.getContact() == null || member.getContact().length() < 10 || member.getContact().length() > 12) {
            return CommonResult.FAILURE;
        }
        if (this.memberMapper.selectUserByContact(member.getContact()) != null) {
            return SignupResult.FAILURE_DUPLICATE_CONTACT;
        }

        if (this.memberMapper.selectUserById(member.getId()) != null) {
            return SignupResult.FAILURE_DUPLICATE_ID;
        }

        if (this.memberMapper.selectUserByEmail(member.getEmail()) != null) {
            return SignupResult.FAILURE_DUPLICATE_EMAIL;
        }
        EmailTokenEntity dbEmailToken = this.emailTokenMapper.selectEmailTokenByEmail(member.getEmail());
        if (!dbEmailToken.isVerified()) {
            return SignupResult.FAILURE_VERIFY_EMAIL;
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        member.setPassword(encoder.encode(member.getPassword()));
        member.setCreatedAt(LocalDateTime.now());
        member.setUpdatedAt(LocalDateTime.now());
        member.setDeletedAt(null);
        member.setAdmin(false);
        member.setSuspended(false);
        member.setVerified(true);
        if(this.memberMapper.insertMember(member) == 0) {
            throw new TransactionalException();
        }

        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result validateEmailToken(HttpServletRequest request, String email) throws MessagingException {
        if(request == null || email == null || email.length() < 8 || email.length() > 50) {
            return CommonResult.FAILURE;
        }

        EmailTokenEntity emailToken = new EmailTokenEntity();
        emailToken.setUserEmail(email);
        emailToken.setKey(CryptoUtils.hashSha512(String.format("%s%s%f%f",
                email,
                Math.random(),
                Math.random(),
                Math.random())));
        emailToken.setCreatedAt(LocalDateTime.now());
        emailToken.setExpiresAt(LocalDateTime.now().plusHours(1));
        emailToken.setUsed(false);
        if(this.emailTokenMapper.insertEmailToken(emailToken) == 0) {
            throw new TransactionalException();
        }
        String validationLink = String.format("%s://%s:%d/member/validate-email-token?userEmail=%s&key=%s",
                request.getScheme(),
                request.getServerName(),
                request.getServerPort(),
                emailToken.getUserEmail(),
                emailToken.getKey());
        Context context = new Context();
        context.setVariable("validationLink", validationLink);
        String mailText = this.templateEngine.process("email/register", context);
        MimeMessage mimeMessage = this.mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
        mimeMessageHelper.setFrom("ghdtjq0118@gmail.com");
        mimeMessageHelper.setTo(emailToken.getUserEmail());
        mimeMessageHelper.setSubject("[마켓컬리] 이메일 인증 링크");
        mimeMessageHelper.setText(mailText, true);
        this.mailSender.send(mimeMessage);
        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result getValidateEmailToken(EmailTokenEntity emailToken) {
        if(emailToken == null ||
                emailToken.getUserEmail() == null || emailToken.getUserEmail().length() < 8 || emailToken.getUserEmail().length() > 50 ||
                emailToken.getKey() == null || emailToken.getKey().length() != 128) {
            return CommonResult.FAILURE;
        }
        EmailTokenEntity dbEmailToken = this.emailTokenMapper.selectEmailTokenByEmailAndKey(emailToken.getUserEmail(), emailToken.getKey());
        if(dbEmailToken == null || dbEmailToken.isUsed()) { // DB에 존재하지 않거나, 이미 사용된 토큰이면
            return CommonResult.FAILURE;
        }
        if(dbEmailToken.getExpiresAt().isBefore(LocalDateTime.now())) { // 이메일 토큰의 만료 일시가 현재 일시보다 과거면
            return ValidateEmailTokenResult.FAILURE_EXPIRED;
        }
        dbEmailToken.setUsed(true); // 토큰을 사용된 것으로 처리한다. (인증은 한번만 가능함으로)
        dbEmailToken.setVerified(true); // 사용자에 대해 인증처리 된것으로 간주한다.
        if(this.emailTokenMapper.updateEmailToken(dbEmailToken) == 0) {
            throw new TransactionalException();
        }

        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result provokeRecoverPassword(HttpServletRequest request, String id, String email) throws MessagingException {

        if(id == null || id.length() < 6 || id.length() > 16 ||
                email == null || email.length() < 8 || email.length() > 50) {
            return CommonResult.FAILURE;
        }

        MemberEntity user = this.memberMapper.selectUserByEmail(email);
        if(user == null || user.getDeletedAt() != null) {
            return CommonResult.FAILURE;
        }
        EmailTokenEntity emailToken = new EmailTokenEntity();
        emailToken.setUserEmail(user.getEmail());
        emailToken.setKey(CryptoUtils.hashSha512(String.format("%s%s%f%f",
                user.getEmail(),
                Math.random(),
                Math.random(),
                Math.random())));
        emailToken.setCreatedAt(LocalDateTime.now());
        emailToken.setExpiresAt(LocalDateTime.now().plusHours(1));
        emailToken.setUsed(false);
        if(this.emailTokenMapper.insertEmailToken(emailToken) == 0) {
            throw new TransactionalException();
        }
        String validationLink = String.format("%s://%s:%d/member/recover-password?userEmail=%s&key=%s",
                request.getScheme(),
                request.getServerName(),
                request.getServerPort(),
                emailToken.getUserEmail(),
                emailToken.getKey());
        Context context = new Context();
        context.setVariable("validationLink", validationLink);
        context.setVariable("name", user.getUserName());
        String mailText = this.templateEngine.process("email/recoverPassword", context);
        MimeMessage mimeMessage = this.mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
        mimeMessageHelper.setFrom("ghdtjq0118@gmail.com");
        mimeMessageHelper.setTo(emailToken.getUserEmail());
        mimeMessageHelper.setSubject("[마켓컬리] 비밀번호 재설정 링크");
        mimeMessageHelper.setText(mailText, true);
        this.mailSender.send(mimeMessage);
        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result resolveRecoverPassword(EmailTokenEntity emailToken, String password) {
        if(emailToken == null ||
                emailToken.getUserEmail() == null || emailToken.getUserEmail().length() < 8 || emailToken.getUserEmail().length() > 50 ||
                emailToken.getKey() == null || emailToken.getKey().length() != 128 ||
                password == null || password.length() < 10 || password.length() > 16) {
            return CommonResult.FAILURE;
        }
        EmailTokenEntity dbEmailToken = this.emailTokenMapper.selectEmailTokenByEmailAndKey(emailToken.getUserEmail(), emailToken.getKey());
        if(dbEmailToken == null || dbEmailToken.isUsed()) {
            return CommonResult.FAILURE;
        }
        if(dbEmailToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResolveRecoverPasswordResult.FAILURE_EXPIRED;
        }
        dbEmailToken.setUsed(true);
        dbEmailToken.setVerified(true);
        if(this.emailTokenMapper.updateEmailToken(dbEmailToken) == 0) {
            throw new TransactionalException();
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        MemberEntity member = this.memberMapper.selectUserByEmail(emailToken.getUserEmail());
        member.setPassword(encoder.encode(password));
        if(this.memberMapper.updateMember(member) == 0) {
            throw new TransactionalException();
        }
        return CommonResult.SUCCESS;
    }

    public Result passwordCheck(MemberEntity member, String password){
        if(member == null || password == null || password.length() < 10 || password.length() > 16) {return CommonResult.FAILURE;}

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if(!BCrypt.checkpw(password, member.getPassword())) {

            return CommonResult.FAILURE;
        }
        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result updateInfoModify(MemberEntity member){
        if(member == null ||
           member.getId() == null || member.getId().length() < 6 || member.getId().length() > 16 ||
           member.getPassword() == null || member.getPassword().length() < 10 || member.getPassword().length() > 16 || member.getUserName() == null ||
           member.getEmail() == null || member.getEmail().length() < 8 || member.getEmail().length() > 50) {
            return CommonResult.FAILURE;
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        MemberEntity dbMember = this.memberMapper.selectUserByEmail(member.getEmail());
        dbMember.setPassword(encoder.encode(member.getPassword()));
        dbMember.setUserName(member.getUserName());
        dbMember.setAddress(member.getAddress());
        dbMember.setUpdatedAt(LocalDateTime.now());
        if(this.memberMapper.updateMember(dbMember) == 0) {
            throw new TransactionalException();
        }

        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result leaveMember(MemberEntity member, String password){
        if(member == null || password == null || password.length() < 10 || password.length() > 16) {
            return CommonResult.FAILURE;
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if(!BCrypt.checkpw(password, member.getPassword())) {
            return CommonResult.FAILURE;
        }
        member.setDeletedAt(LocalDateTime.now());
        if(this.memberMapper.updateMember(member) == 0) {
            throw new TransactionalException();
        }

        return CommonResult.SUCCESS;
    }
}


















