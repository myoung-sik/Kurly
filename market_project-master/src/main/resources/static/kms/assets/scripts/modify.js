document.addEventListener("DOMContentLoaded", function () {
    const $modifyForm = document.getElementById('modifyForm');
    const $title = document.querySelector('[name="title"]');
    const $content = document.querySelector('[name="content"]');
    const $imageInput = document.getElementById('imageInput');
    const $imageButton = document.getElementById('imageButton');

    $imageButton.addEventListener("click", () => {
        $imageInput.click();
    });

    $modifyForm.onsubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        const urlParams = new URLSearchParams(window.location.search);
        const index = urlParams.get('index');

        if (!index) {
            alert("잘못된 요청입니다.");
            return;
        }

        formData.append('index', index);
        formData.append('title', $title.value);
        formData.append('content', $content.value);
        if ($imageInput.files.length > 0) {
            formData.append('image', $imageInput.files[0]);
        }

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.result === 'success') {
                        alert('수정이 완료되었습니다.');
                        window.location.href = '/goods/index';
                    } else {
                        alert('수정에 실패했습니다.');
                    }
                } else {
                    alert('수정에 실패했습니다. 다시 시도해주세요.');
                }
            }
        };
        xhr.open('PATCH', '/goods/modify');
        xhr.send(formData);
    };
});