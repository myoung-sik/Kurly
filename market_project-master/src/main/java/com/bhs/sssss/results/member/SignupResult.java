package com.bhs.sssss.results.member;

import com.bhs.sssss.results.Result;

public enum SignupResult implements Result {
    FAILURE_DUPLICATE_CONTACT,
    FAILURE_DUPLICATE_EMAIL,
    FAILURE_DUPLICATE_ID,
    FAILURE_VERIFY_EMAIL
}
