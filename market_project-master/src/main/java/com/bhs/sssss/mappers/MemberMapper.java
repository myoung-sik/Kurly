package com.bhs.sssss.mappers;

import com.bhs.sssss.entities.MemberEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {
    int selectMembersCount();

    int selectMembersCountBySearch(@Param("keyword") String keyword);

    MemberEntity[] selectMembers(@Param("limitCount") int limitCount,
                                 @Param("offsetCount") int offsetCount);

    MemberEntity[] selectMembersBySearch(@Param("keyword") String keyword,
                                         @Param("limitCount") int limitCount,
                                         @Param("offsetCount") int offsetCount);

    MemberEntity selectUserByContact(@Param("contact") String contact);

    MemberEntity selectUserById(@Param("id") String id);

    MemberEntity selectUserByIdIncludeDeleted(@Param("id") String id);

    MemberEntity selectUserByEmail(@Param("email") String email);

    MemberEntity selectUserByNameAndEmail(@Param("userName") String userName, @Param("email") String email);

    int insertMember(MemberEntity member);

    int updateMember(MemberEntity member);
}
