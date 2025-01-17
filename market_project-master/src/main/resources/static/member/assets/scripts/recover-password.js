const $recoverForm = document.getElementById('recover-form');
let regPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{10,16}$/;
const $warn = Array.from($recoverForm.querySelectorAll(':scope > .recover-wrapper > .label-container > .-warning'));

//비밀번호 유효성 검사
$recoverForm['password'].addEventListener('keyup', () => {
    const pw = $recoverForm['password'].value;

    if (!regPw.test(pw)) {
        $warn[0].innerText = '영문/숫자/특수문자(공백 제외)만 허용하며, 3개 조합';
        if (pw.length > 1) {
            $warn[0].innerText = '최소 10자 이상 입력';
        }
        $warn[0].style.display = 'block';

    } else {
        $warn[0].style.display = 'none';
    }
});

$recoverForm['passwordCheck'].addEventListener('keyup', () => {
    const pwCheck = $recoverForm['passwordCheck'].value;

    if (pwCheck !== $recoverForm['password'].value) {
        $warn[1].innerText = '비밀번호를 한번 더 입력해 주세요.';
        if (pwCheck.length > 1) {
            $warn[1].innerText = '동일한 비밀번호를 입력';
        }
        $warn[1].style.display = 'block';

    } else if (pwCheck === $recoverForm['password'].value && $recoverForm['password'].value.length >= 10) {
        $warn[1].style.display = 'none';
        $recoverForm.querySelector(':scope > .button-container > .recover').classList.remove('--color-disabled');
        $recoverForm.querySelector(':scope > .button-container > .recover').classList.add('--color-primary');
        $recoverForm.querySelector(':scope > .button-container > .recover').style.pointerEvents = 'all';
    }
});


$recoverForm.onsubmit = (e) => {
    e.preventDefault();

    if(!regPw.test($recoverForm['password'].value) || $recoverForm['password'].value !== $recoverForm['passwordCheck'].value || $recoverForm['password'].value === ''){
        Dialog.show({
            content: '입력값을 확인해 주세요.',
            buttons: [{
                text: '확인',
                onclick: ($dialog) => Dialog.hide($dialog)
            }]
        });
        return;
    }

    const formData = new FormData();
    formData.append('userEmail', $recoverForm['email'].value);
    formData.append('key', $recoverForm['key'].value);
    formData.append('password', $recoverForm['password'].value);
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
        document.getElementById('main').style.display = 'none';
        document.querySelector('.result-container').style.display = 'block';

        if(response['result'] === 'success'){
            document.querySelector('.result-container > .result-page > .content-box[rel="success"]').style.display = 'block';
            document.getElementById('username').innerText = response['name'];
        }
        if (response['result'] === 'failure'){
            document.querySelector('.result-container > .result-page > .content-box[rel="failure"]').style.display = 'block';
        }
        if (response['result'] === 'failure_expired'){
            document.querySelector('.result-container > .result-page > .content-box[rel="failure-expired"]').style.display = 'block';
        }

    };
    xhr.open('PATCH', '/member/recover-password');
    xhr.send(formData);
};