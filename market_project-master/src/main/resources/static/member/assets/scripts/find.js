const $findForm = document.getElementById('find-form');
const $warn = Array.from($findForm.querySelectorAll(':scope > .find-wrapper > .label-container > .-warning'));
const $title = document.querySelector('#main > .title > .title-text');
let regEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

// if($findForm.querySelector(':scope > .find-wrapper > .label-container').value)

if ($title.textContent === '아이디 찾기') {
    $findForm.querySelector(':scope > .find-wrapper > .name').style.display = 'block';
    $findForm.querySelector(':scope > .find-wrapper > .id').style.display = 'none';
    $findForm['name'].addEventListener('keyup', () => {
        if ($findForm['name'].value.length < 1) {
            $warn[0].innerText = '이름을 입력해 주세요.';
            $warn[0].style.display = 'block';
        } else {
            $warn[0].style.display = 'none';
        }
    });
} else {
    $findForm.querySelector(':scope > .find-wrapper > .name').style.display = 'none';
    $findForm.querySelector(':scope > .find-wrapper > .id').style.display = 'block';
    $findForm['memberId'].addEventListener('keyup', () => {

        if ($findForm['memberId'].value.length < 1) {
            $warn[1].innerText = '가입 시 등록한 아이디를 입력해 주세요.';
            $warn[1].style.display = 'block';
        } else {
            $warn[1].style.display = 'none';
            buttonActive();
        }
    });
}


$findForm['email'].addEventListener('keyup', () => {
    const email = $findForm['email'].value;

    if (!regEmail.test(email)) {
        $warn[2].innerText = '이메일 형식으로 입력해 주세요.';
        if (email.length < 1) {
            $warn[2].innerText = '가입 시 등록한 이메일을 입력해 주세요.';
        }
        $warn[2].style.display = 'block';

    } else {
        $warn[2].style.display = 'none';
        buttonActive();
    }
});

// 버튼 활성화 기능
const buttonActive = () => {
    if (($findForm['name'].value !== '' || $findForm['memberId'].value !== '') && $findForm['email'].value !== '') {
        $findForm.querySelector(':scope > .button-container > .find').classList.remove('--color-disabled');
        $findForm.querySelector(':scope > .button-container > .find').classList.add('--color-primary');
        $findForm.querySelector(':scope > .button-container > .find').style.pointerEvents = 'all';
    } else {
        $findForm.querySelector(':scope > .button-container > .find').classList.remove('--color-primary');
        $findForm.querySelector(':scope > .button-container > .find').classList.add('--color-disabled');
    }
};


$findForm.onsubmit = (e) => {
    e.preventDefault();
    if ($title.textContent === '아이디 찾기') {
        if ($findForm['name'].value === '' || $findForm['email'].value.length < 8 || $findForm['email'].value.length > 50) {
            Dialog.show({
                content: '입력값을 확인해 주세요',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
            return;
        }

        const formData = new FormData();
        formData.append('userName', $findForm['name'].value);
        formData.append('email', $findForm['email'].value);

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
            document.getElementById('main').style.display = 'none';
            document.querySelector('.result-container').style.display = 'block';
            document.querySelector('.result-container > .result-page > .content-box[rel="id"]').style.display = 'block';
            if(response['result'] === 'success'){
                document.querySelector('.result-container > .result-page > .content-box[rel="id"] > .first > .name').innerText = $findForm['name'].value;
                document.querySelector('.result-container > .result-page > .content-box[rel="id"] > .second').innerText = response['id'];
            } else {
                document.querySelector('.result-container > .result-page > .content-box[rel="id"] > .first > .name').innerText = '아이디 찾기에 실패하였습니다.';
                document.querySelector('.result-container > .result-page > .content-box[rel="id"] > .first').innerText = '다시 시도해 주세요.';
            }
        };
        xhr.open('POST', '/member/recover-id');
        xhr.send(formData);

    } else {
        if ($findForm['memberId'].value.length < 6 || $findForm['memberId'].value.length > 16 || $findForm['email'].value.length < 8 || $findForm['email'].value.length > 50) {
            Dialog.show({
                content: '입력값을 확인해 주세요',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
            return;
        }

        document.getElementById('main').style.display = 'none';
        document.querySelector('.result-container').style.display = 'block';
        document.querySelector('.result-container > .result-page > .content-box').style.display = 'block';
        document.querySelector('.result-container > .result-page > .content-box > .first > .email').innerText = $findForm['email'].value;

        const formData = new FormData();
        formData.append('memberId', $findForm['memberId'].value);
        formData.append('email', $findForm['email'].value);

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
            //TODO failure 처리

        };
        xhr.open('POST', '/member/recover-password');
        xhr.send(formData);
    }

};









