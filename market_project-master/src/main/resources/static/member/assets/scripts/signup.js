const $agreeForm = document.getElementById('agree-form');
const $wrapper1 = $agreeForm.querySelector(':scope > .text-wrapper > .wrapper1');
const $agreeAllCheck = $wrapper1.querySelector(':scope > .agree-box > .agreeAll-label > .input');
const $receptionAgreeCheck = $wrapper1.querySelector(':scope > .reception-agree-box > .content-box > .content-label > input[type="checkbox"]');

const $signupForm = document.getElementById('signup-form');
const $findAddressButton = $signupForm.querySelector(':scope > .signup-wrapper > .address > .wrapper1 > .find-button');
const $researchAddressButton = $signupForm.querySelector(':scope > .signup-wrapper > .info-box > .empty-box > .research-button');

//region 전체 동의 눌렀을때 전부 체크
$agreeAllCheck.onclick = () => {
    if ($agreeAllCheck.checked === false) {
        $agreeAllCheck.checked = false;
        $wrapper1.querySelectorAll(':scope > .agree-box > .content-box > .content-label > input[type="checkbox"]').forEach((x) => x.checked = false);
        $receptionAgreeCheck.checked = false;
        $wrapper1.querySelectorAll(':scope > .reception-agree-box > .contact-box > .contact-label > input[type="checkbox"]').forEach((x) => x.checked = false);

    } else {
        $agreeAllCheck.checked = true;
        $wrapper1.querySelectorAll(':scope > .agree-box > .content-box > .content-label > input[type="checkbox"]').forEach((x) => x.checked = true);
        $receptionAgreeCheck.checked = true;
        $wrapper1.querySelectorAll(':scope > .reception-agree-box > .contact-box > .contact-label > input[type="checkbox"]').forEach((x) => x.checked = true);
    }
};
//endregion

//region 혜택/정보 수신 동의 눌렀을 때 SMS, 이메일 전부 체크
$receptionAgreeCheck.onclick = () => {
    if ($receptionAgreeCheck.checked === false) {
        $receptionAgreeCheck.checked = false;
        $wrapper1.querySelectorAll(':scope > .reception-agree-box > .contact-box > .contact-label > input[type="checkbox"]').forEach((x) => x.checked = false);
    } else {
        $receptionAgreeCheck.checked = true;
        $wrapper1.querySelectorAll(':scope > .reception-agree-box > .contact-box > .contact-label > input[type="checkbox"]').forEach((x) => x.checked = true);
    }
};
//endregion

//region 이메일 주소 선택

const $emailChoice = document.getElementById('email-choice');
const $emailChoiceButton = $emailChoice.querySelectorAll(':scope > button[rel="email"]');
const $emailListContainer = $emailChoice.querySelector(':scope > .list-container');
const $item = $emailListContainer.querySelectorAll(':scope > .dropdown__item');
const $btnText = $emailChoice.querySelector(':scope > .btn-text');
const $inputText = $emailChoice.querySelector(':scope > .input-text');

$emailChoiceButton.forEach((x) => x.onclick = () => {
    $emailListContainer.style.display === 'flex' ? $emailListContainer.style.display = 'none' : $emailListContainer.style.display = 'flex';

    $item.forEach((x) => x.onclick = () => {
        if (x.textContent === '직접 입력') {
            $btnText.style.display = 'none';
            $inputText.style.display = 'flex';
            $emailListContainer.style.display = 'none';
        } else {
            $btnText.innerText = x.textContent;
            $btnText.style.color = 'rgb(51, 51, 51)';
            $btnText.style.display = 'flex';
            $inputText.style.display = 'none';
            $emailListContainer.style.display = 'none';
            $signupForm['emailDomain'].value = x.textContent.replaceAll(' ', '');
            emailDuplicationCheck();
        }
    });
});


//endregion

//region 이메일 인증

const $validateEmailButton = document.getElementById('email-button');
$validateEmailButton.onclick = () => {

    const url = new URL(location.href);
    url.pathname = `member/validate-email`;

    const formData = new FormData();
    formData.append('email', $signupForm['email'].value);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE){
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            Dialog.show({
                content: `요청을 전송하는 도중 오류가 발생하였습니다.<br>잠시 후 다시 시도해 주세요.`,
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
            return;
        }
        const response = JSON.parse(xhr.responseText);
        if (response['result'] === 'success') {
            $isValid[4].innerText = "메일을 전송하였습니다.";
            $isValid[4].style.display = 'block';
            $warn[4].style.display = 'none';
            document.getElementById('email-button').style.color = 'rgb(204, 204, 204)';
            document.getElementById('email-button').style.borderColor = 'rgb(204, 204, 204)';
            document.getElementById('email-button').style.pointerEvents = 'none';
        } else {
            $warn[4].innerText = '메일을 전송하지 못했습니다. 다시 시도해 주세요.';
            $isValid[4].style.display = 'none';
            $warn[4].style.display = 'block';
        }

    };
    xhr.open('POST', url.toString());
    xhr.send(formData);
};

//endregion

//region 주소 검색 기능 -> 주소 검색 버튼 눌렀을 때 팝업창
$findAddressButton.onclick = () => {
    findAddress();
    $findAddressButton.style.display = 'none';
    $researchAddressButton.style.display = 'block';
    $signupForm.querySelectorAll(':scope > .signup-wrapper > .address > .wrapper1 > .address-box').forEach((x) => x.style.display = 'block');
    document.getElementById("subAddress").focus();
};

$researchAddressButton.onclick = () => {
    findAddress();
    document.getElementById("subAddress").focus();
};

function findAddress() {
    const width = 530;
    const height = 569;

    new daum.Postcode({
        width: width,
        height: height,
        oncomplete: function (data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var roadAddr = data.roadAddress; // 도로명 주소 변수
            var extraRoadAddr = ''; // 참고 항목 변수

            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraRoadAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== '' && data.apartment === 'Y') {
                extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (extraRoadAddr !== '') {
                extraRoadAddr = ' (' + extraRoadAddr + ')';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById("address").value = roadAddr;
        }
    }).open({
        left: (window.screen.width / 2) - (width / 2),
        top: (window.screen.height / 2) - (height / 2),
        popupTitle: '칼리 - 마켓칼리',
        popupKey: 'popup1',
    });
}

//endregion

//TODO 있음
//region 입력값 유효성 검사 후 경고메세지 띄우기(span)
// onkeyup 으로 유효성 검사, 정규표현식 사용, test() 사용
let regId = /^[a-zA-Z0-9]{6,16}$/;
let regPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{10,16}$/;
let regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])+$/;
let regContact = /^[0-9]{1,11}$/;

const $warn = Array.from($signupForm.querySelectorAll(':scope > .signup-wrapper > .info-box > .wrapper1 > .wrapper2 > .-warning'));
const $isValid = Array.from($signupForm.querySelectorAll(':scope > .signup-wrapper > .info-box > .wrapper1 > .wrapper2 > .-isValid'));

//아이디 유효성 검사
$signupForm['memberId'].addEventListener('keyup', () => {

    const id = $signupForm['memberId'].value;

    if (!regId.test(id)) {
        $warn[0].innerText = '6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합';
        $isValid[0].style.display = 'none';
        $warn[0].style.display = 'block';
    } else {
        $warn[0].style.display = 'none';
    }
});

//비밀번호 유효성 검사
$signupForm['password'].addEventListener('keyup', () => {
    const pw = $signupForm['password'].value;

    if (!regPw.test(pw)) {
        $warn[1].innerText = '영문/숫자/특수문자(공백 제외)만 허용하며, 3개 조합';
        if (pw.length > 1) {
            $warn[1].innerText = '최소 10자 이상 입력';
        }
        $warn[1].style.display = 'block';

    } else {
        $warn[1].style.display = 'none';
    }
});

//비밀번호 확인
$signupForm['passwordConfirm'].addEventListener('keyup', () => {
    const pwConfirm = $signupForm['passwordConfirm'].value;

    if (pwConfirm !== $signupForm['password'].value) {
        $warn[2].innerText = '비밀번호를 한번 더 입력해 주세요.';
        if (pwConfirm.length > 1) {
            $warn[2].innerText = '동일한 비밀번호를 입력';
        }
        $warn[2].style.display = 'block';

    } else if (pwConfirm === $signupForm['password'].value && $signupForm['password'].value.length >= 10) {
        $warn[2].style.display = 'none';
        $isValid[2].innerText = "비밀번호 일치";
        $isValid[2].style.display = 'block';
    }
});

//이름
$signupForm['name'].addEventListener('keyup', () => {
    if ($signupForm['name'].value.length < 1) {
        $warn[3].innerText = '이름을 입력해 주세요.';
        $warn[3].style.display = 'block';
    } else {
        $warn[3].style.display = 'none';
    }
});

//이메일
$signupForm['emailId'].addEventListener('keyup', () => {
    const emailId = $signupForm['emailId'].value;

    if (!regEmail.test(emailId)) {
        $warn[4].innerText = '이메일 형식으로 입력해 주세요.';
        if (emailId.length < 1) {
            $warn[4].innerText = '이메일을 입력해 주세요.';
        }
        $warn[4].style.display = 'block';

    } else {
        $warn[4].style.display = 'none';
    }
});

//휴대폰 번호
$signupForm['contact'].addEventListener('keyup', () => {
    const contact = $signupForm['contact'].value;

    if (!regContact.test(contact)) {
        if (contact.length < 1) {
            $warn[5].innerText = '휴대폰 번호를 입력해 주세요.';
        }
        $warn[5].style.display = 'block';

    } else {
        $warn[5].style.display = 'none';
    }
});

//TODO 윤년 계산
const $birthWarn = $signupForm.querySelector(':scope > .signup-wrapper > .info-box > .wrapper1 > .-warning');

//생년월일
const checkBirth = () => {
    const birthYear = $signupForm['birthYear'].value;
    const birthMonth = $signupForm['birthMonth'].value;
    const birthDay = $signupForm['birthDay'].value;

    if (birthYear.length < 4) {
        $birthWarn.innerText = '태어난 년도 4자리를 정확하게 입력해 주세요.';
        $birthWarn.style.display = 'block';
    } else if (birthYear < '1920') {
        $birthWarn.innerText = '생년월일을 다시 확인해 주세요.';
        $birthWarn.style.display = 'block';
    } else if (birthYear > '2025') {
        $birthWarn.innerText = '미래를 입력했습니다.';
        $birthWarn.style.display = 'block';
    } else {
        if (birthMonth < '01' || birthMonth > '12') {
            $birthWarn.innerText = '태어난 월을 정확히 입력해 주세요.';
            $birthWarn.style.display = 'block';
        } else {
            if (birthDay < '01' || birthDay > '31') {
                $birthWarn.innerText = '태어난 일을 정확히 입력해 주세요.';
                $birthWarn.style.display = 'block';
            } else {
                $birthWarn.style.display = 'none';
            }
        }
    }
};

$signupForm['birthYear'].addEventListener('keyup', () => checkBirth());
$signupForm['birthMonth'].addEventListener('keyup', () => checkBirth());
$signupForm['birthDay'].addEventListener('keyup', () => checkBirth());

//endregion


//region id, email, contact 중복 검사(duplication-check)

// id duplication-check -> 입력칸 나가면 자동으로 POST 요청 -> 결과에 따라 메세지 처리
$signupForm['memberId'].addEventListener('change', () => {
    const formData = new FormData();
    formData.append('memberId', $signupForm['memberId'].value);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            '오류';
            return;
        }
        const response = JSON.parse(xhr.responseText);
        if (response['result'] === 'success') {
            $isValid[0].innerText = "사용 가능한 아이디입니다.";
            $isValid[0].style.display = 'block';
            $warn[0].style.display = 'none';
        } else if (response['result'] === 'failure_duplicate_id') {
            $warn[0].innerText = '사용 불가능한 아이디입니다.';
            $isValid[0].style.display = 'none';
            $warn[0].style.display = 'block';
        } else {
            alert('오류');
        }
    };
    xhr.open('POST', './duplication-check');
    xhr.send(formData);
});

// email duplication-check -> xhr 요청 함수화 (직접입력, 선택 할 경우 다르기 때문)
// 직접 입력할 경우 마찬가지로 입력칸 나가면 요청 / 버튼 선택할 경우 위에 클릭 이벤트에서 같이 실행
const emailDuplicationCheck = () => {
    if ($signupForm['emailId'].value !== '' && $signupForm['emailDomain'].value !== '') {
        $signupForm['email'].value = `${$signupForm['emailId'].value}@${$signupForm['emailDomain'].value}`;

        const formData = new FormData();
        formData.append('email', $signupForm['email'].value);
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                Dialog.show({
                    content: `요청을 전송하는 도중 오류가 발생하였습니다.<br>잠시 후 다시 시도해 주세요.`,
                    buttons: [{
                        text: '확인',
                        onclick: ($dialog) => Dialog.hide($dialog)
                    }]
                });
                return;
            }
            const response = JSON.parse(xhr.responseText);
            if (response['result'] === 'success') {
                $isValid[4].innerText = "사용 가능한 이메일입니다.";
                $isValid[4].style.display = 'block';
                $warn[4].style.display = 'none';
                document.getElementById('email-button').style.color = 'rgb(95, 0, 128)';
                document.getElementById('email-button').style.borderColor = 'rgb(95, 0, 128)';
                document.getElementById('email-button').style.pointerEvents = 'all';
            } else if (response['result'] === 'failure_duplicate_email') {
                $warn[4].innerText = '사용 불가능한 이메일입니다.';
                $isValid[4].style.display = 'none';
                $warn[4].style.display = 'block';
            } else {
                Dialog.show({
                    content: '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요',
                    buttons: [{
                        text: '확인', onclick: ($dialog) => Dialog.hide($dialog)
                    }]
                });
            }
        };
        xhr.open('POST', './duplication-check');
        xhr.send(formData);
    } else {
        alert('이메일 주소를 입력해 주세요.');
    }
};
// 이메일 직접 입력할때
$signupForm['emailDomain'].addEventListener('change', () => {
    emailDuplicationCheck();

});
// contact duplication-check -> 연락처 쓰고 입력칸 바깥으로 나가면 자동으로 POST 요청 -> 결과 처리
$signupForm['contact'].addEventListener('change', () => {
    const formData = new FormData();
    formData.append('contact', $signupForm['contact'].value);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            '오류';
            return;
        }
        const response = JSON.parse(xhr.responseText);
        if (response['result'] === 'success') {
            $isValid[5].innerText = "사용 가능";
            $isValid[5].style.display = 'block';
            $warn[5].style.display = 'none';
        } else if (response['result'] === 'failure_duplicate_contact') {
            $warn[5].innerText = '이미 등록된 전화번호입니다.';
            $isValid[5].style.display = 'none';
            $warn[5].style.display = 'block';
        } else {
            alert('오류');
        }
    };
    xhr.open('POST', './duplication-check');
    xhr.send(formData);
});

//endregion


//region 회원가입 post 요청

$signupForm.onsubmit = (e) => {
    e.preventDefault();

    const $RequiredTermsCondition = document.getElementById('RequiredTermsCondition');
    const $RequiredTermsOfPrivacy = document.getElementById('RequiredTermsOfPrivacy');
    const $RequiredSignupAge = document.getElementById('RequiredSignupAge');

    if($signupForm['memberId'].value.length < 6 || $signupForm['memberId'].value.length > 16){
        Dialog.show({
            content: '아이디 중복검사를 해주세요.',
            buttons: [{
                text: '확인', onclick: ($dialog) => Dialog.hide($dialog)
            }]
        });
        return;
    }

    if($signupForm['password'].value.length < 6 || $signupForm['password'].value.length > 16 ||
       $signupForm['email'].value.length < 8 || $signupForm['email'].value.length > 50 ||
       $signupForm['contact'].value.length < 10 || $signupForm['contact'].value.length > 12 ||
       $signupForm['address'].value === '') {
        Dialog.show({
            content: '입력값을 확인해 주세요.',
            buttons: [{
                text: '확인', onclick: ($dialog) => Dialog.hide($dialog)
            }]
        });
        return;
    }
    if($signupForm['password'].value !== $signupForm['passwordConfirm'].value){
        Dialog.show({
            content: '비밀번호가 일치하지 않습니다.',
            buttons: [{
                text: '확인', onclick: ($dialog) => Dialog.hide($dialog)
            }]
        });
        return;
    }

    if(!$RequiredTermsCondition.checked || !$RequiredTermsOfPrivacy.checked || !$RequiredSignupAge.checked){
        Dialog.show({
            content: '이용약관 필수항목에 동의하지 않으면 회원가입을 하실 수 없습니다.',
            buttons: [{
                text: '확인', onclick: ($dialog) => Dialog.hide($dialog)
            }]
        });
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('id', $signupForm['memberId'].value);
    formData.append('password', $signupForm['password'].value);
    formData.append('userName', $signupForm['name'].value);
    formData.append('email', $signupForm['email'].value);
    formData.append('contact', $signupForm['contact'].value);
    formData.append('address', $signupForm['address'].value);
    formData.append('gender', $signupForm['gender'].value);
    formData.append(`birth`, `${$signupForm['birthYear'].value}${$signupForm['birthMonth'].value}${$signupForm['birthDay'].value}`);

    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            Dialog.show({
                content: `요청을 전송하는 도중 오류가 발생하였습니다.<br>잠시 후 다시 시도해 주세요.`,
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
            return;
        }
        const response = JSON.parse(xhr.responseText);
        const [content, onclick] = {
            failure: ['회원가입에 실패하였습니다.', ($dialog) => {
                Dialog.hide($dialog);
                $signupForm['memberId'].focus();
            }],
            failure_duplicate_id: ['아이디 중복 체크를 해주세요.', ($dialog) => {
                Dialog.hide($dialog);
                $signupForm['memberId'].focus();
            }],
            failure_duplicate_contact: ['연락처 중복 체크를 해주세요.', ($dialog) => {
                Dialog.hide($dialog);
                $signupForm['memberId'].focus();
            }],
            failure_duplicate_email: ['이메일 중복 체크를 해주세요.', ($dialog) => {
                Dialog.hide($dialog);
                $signupForm['emailId'].focus();
            }],
            failure_verify_email: ['이메일 인증을 진행해 주세요.', ($dialog) => {
                Dialog.hide($dialog);
                $signupForm['emailId'].focus();
            }],
            success: ['회원가입에 성공하였습니다.', ($dialog) => {
                Dialog.hide($dialog);
                const url = new URL(location.href);
                url.pathname = 'member/login';
                location.href = url.toString();

            }]
        }[response['result']] || ['서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog)];
        Dialog.show({
            content: content,
            buttons: [{
                text: '확인', onclick: onclick
            }]
        });
    };
    xhr.open('POST', '/member/signup');
    xhr.send(formData);
};

//endregion







