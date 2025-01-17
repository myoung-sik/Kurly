const $loginForm = document.getElementById('login-form');

$loginForm.onsubmit = (e) => {
    e.preventDefault();


    if($loginForm['memberId'].value.length < 6 || $loginForm['memberId'].value.length > 16 ||
       $loginForm['password'].value.length < 6 || $loginForm['password'].value.length > 16) {
        Dialog.show({
            content: '아이디 혹은 비밀번호를 확인해 주세요.',
            buttons: [{
                text: '확인', onclick: ($dialog) => Dialog.hide($dialog)
            }]
        });
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('id', $loginForm['memberId'].value);
    formData.append('password', $loginForm['password'].value);
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
        if(response['result'] === 'failure'){
            Dialog.show({
                content: `아이디, 비밀번호가 정확하지 않습니다.<br> 다시 확인해주세요.`,
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
        } else if ( response['result'] === 'failure_not_verified'){
            Dialog.show({
                content: `이메일 인증이 완료되지 않았습니다.<br> 회원가입을 진행해 주세요.`,
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
        } else if (response['result'] === 'failure_suspended'){
            Dialog.show({
                content: `활동이 정지되었습니다.<br> 고객센터로 문의해주세요.`,
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
        }
        if(response['result'] === 'success'){
            const url = new URL(location.href);
            url.pathname = 'main';
            location.href = url.toString();
        }

    };
    xhr.open('POST', '/member/login');
    xhr.send(formData);

};