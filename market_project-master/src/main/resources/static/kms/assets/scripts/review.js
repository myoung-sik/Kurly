document.addEventListener("DOMContentLoaded", function () {
    const $reviewForm = document.getElementById('reviewForm');
    const $result = document.getElementById('result');
    const $title = document.querySelector('[name="title"]');
    const $content = document.querySelector('[name="content"]');
    const $imageInput = document.getElementById('imageInput');
    const $imageButton = document.getElementById('imageButton');

    $imageButton.addEventListener("click", () => {
        $imageInput.click();
    });

    $reviewForm.onsubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('writer', '작성자');
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
                        $result.innerText = '후기를 성공적으로 작성하였습니다.';
                        $result.style.color = 'green';
                        window.location.href = '/goods/detail?page=1';
                    } else {
                        $result.innerText = '후기 작성에 실패하였습니다.';
                        $result.style.color = 'red';
                    }
                } else {
                    alert('후기를 작성하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            }
        };
        xhr.open('POST', location.href);
        xhr.send(formData);

        $title.value = '';
        $content.value = '';
        $imageInput.value = '';
    };
});