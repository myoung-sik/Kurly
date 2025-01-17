package com.bhs.sssss.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode(of = {"id"})
public class MemberEntity {
    private String id;
    private int cartId;
    private String password;
    private String userName;
    private String email;
    private String contact;
    private String address;
    private String gender;
    private String birth;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    private boolean isAdmin;
    private boolean isSuspended;
    private boolean isVerified;
}
