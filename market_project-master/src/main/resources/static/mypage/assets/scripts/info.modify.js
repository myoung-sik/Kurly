
//region modify 페이지 회원 정보 수정
const $modifyForm = document.getElementById('modify-form');

$modifyForm.onsubmit = (e) => {
    e.preventDefault();

    if($modifyForm['password'].value.length < 10 || $modifyForm['password'].value.length > 16 || $modifyForm['password'].value.length < 10){
        Dialog.show({
            content: '비밀번호 길이 확인',
            buttons: [{
                text: '확인', onclick: ($dialog) => Dialog.hide($dialog)
            }]
        });
        return;
    }
    if($modifyForm['password'].value !== $modifyForm['password-check'].value){
        Dialog.show({
            content: '비밀번호 불일치',
            buttons: [{
                text: '확인', onclick: ($dialog) => Dialog.hide($dialog)
            }]
        });
        return;
    }
    if($modifyForm['userName'].value.length < 1 || $modifyForm['userName'].value.length > 15){
        Dialog.show({
            content: '이름을 확인해 주세요.',
            buttons: [{
                text: '확인', onclick: ($dialog) => Dialog.hide($dialog)
            }]
        });
        return;
    }

    const formData = new FormData();
    formData.append('id', $modifyForm['userId'].value);
    formData.append('password', $modifyForm['password'].value);
    formData.append('userName', $modifyForm['userName'].value);
    formData.append('address', $modifyForm['address'].value);
    formData.append('email', $modifyForm['email'].value);
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
        if(response['result'] === 'success'){
            Dialog.show({
                content: `회원정보가 수정되었습니다.<br>다시 로그인 해주세요.`,
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => {
                        Dialog.hide($dialog);
                        location.reload();
                    }
                }]
            });
        } else {
            Dialog.show({
                content: '수정에 실패하였습니다. 잠시 후 다시 시도해 주세요.',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => {
                        Dialog.hide($dialog);
                        location.reload();
                    }
                }]
            });
        }
    };
    xhr.open('PATCH', '/mypage/info/modify');
    xhr.send(formData);
};
//endregion

//region 주소 찾기
const $findAddressButton = $modifyForm.querySelector(':scope > .input-container > .address-box > .empty-box > .find-button');

$findAddressButton.onclick = () => {
    findAddress();
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
