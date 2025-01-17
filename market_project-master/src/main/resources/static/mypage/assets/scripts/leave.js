const $leaveForm = document.getElementById('leave-form');
let regPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{10,16}$/;

$leaveForm.onsubmit = (e) => {
    e.preventDefault();

    if (!regPw.test($leaveForm['password'].value)) {
        Dialog.show({
            content: '비밀번호를 확인해 주세요.',
            buttons: [{
                text: '확인',
                onclick: ($dialog) => Dialog.hide($dialog)
            }]
        });
    } else {
        Dialog.show({
            content: '정말로 탈퇴 하시겠습니까?',
            buttons: [{
                text: '취소',
                onclick: ($dialog) => {
                    Dialog.hide($dialog);
                }
            },{
                text: '확인',
                onclick: ($dialog) => {
                    leaveRequest();
                    Dialog.hide($dialog);
                }
            }]
        });
    }
};

const leaveRequest = () => {
    const formData = new FormData();
    formData.append('password', $leaveForm['password'].value);

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
                content: '탈퇴가 완료되었습니다.',
            });
            setTimeout(() => {
                const url = new URL(location.href);
                url.pathname = '/main';
                location.href = url.toString();
            }, 1500);
        } else {
            Dialog.show({
                content: `비밀번호를 확인해 주세요.`,
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
        }
    };
    xhr.open('PATCH', '/mypage/leave');
    xhr.send(formData);
};