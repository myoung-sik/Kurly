const $confirmForm = document.getElementById('confirm-form');
const $warn = $confirmForm.querySelector(':scope > .input-container > .input-box > .input-box2 > .-warning');

$confirmForm['password'].addEventListener('keyup', () => {
    if($confirmForm['password'].value.length < 1){
        $warn.innerText = '비밀번호를 입력해 주세요.';
        $warn.style.display = 'block';
    } else {
        $warn.style.display = 'none';
    }
});

$confirmForm.onsubmit = (e) => {
    e.preventDefault();

    if($confirmForm['password'].value.length < 10 || $confirmForm['password'].value.length > 16) {
        Dialog.show({
            content: '비밀번호를 확인해 주세요.',
            buttons: [{
                text: '확인', onclick: ($dialog) => Dialog.hide($dialog)
            }]
        });
        return;
    }

    const formData = new FormData();
    formData.append('password', $confirmForm['password'].value);
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
            const url = new URL(location.href);
            url.pathname = '/admin/member-management';
            location.href = url.toString();
        } else {
            Dialog.show({
                content: `비밀번호가 일치하지 않거나<br>관리자 계정이 아닙니다.`,
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
        }
    };
    xhr.open('POST', '/admin/password-check');
    xhr.send(formData);
};


