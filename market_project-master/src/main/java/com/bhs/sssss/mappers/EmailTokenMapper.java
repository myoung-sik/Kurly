package com.bhs.sssss.mappers;

import com.bhs.sssss.entities.EmailTokenEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface EmailTokenMapper {
    int insertEmailToken(EmailTokenEntity emailToken);

    EmailTokenEntity selectEmailTokenByEmailAndKey(@Param("userEmail") String userEmail, @Param("key") String key);

    EmailTokenEntity selectEmailTokenByEmail(@Param("userEmail") String userEmail);

    int updateEmailToken(EmailTokenEntity emailToken);
}
