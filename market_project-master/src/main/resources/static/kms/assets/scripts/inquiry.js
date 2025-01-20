document.addEventListener("DOMContentLoaded", function () {
    const $inquiryForm = document.getElementById('inquiryForm');
    const $result = document.getElementById('result');
    const $title = document.body.querySelector('[name="title"]');
    const $content = document.body.querySelector('[name="content"]');

    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('itemId');

    $inquiryForm.onsubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('writer', '작성자'); // 여기서 '작성자'는 실제 로그인된 사용자의 정보로 변경 필요
        formData.append('title', $title.value);
        formData.append('content', $content.value);
        formData.append('status', '답변완료'); // 작성자랑 마찬가지
        formData.append('itemId', itemId);

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    if (response['result'] === 'success') {
                        $result.innerText = '문의를 성공적으로 작성하였습니다.';
                        alert('문의를 성공적으로 작성하였습니다.');
                        $result.style.color = 'green';
                        window.location.href = `/goods/detail?page=1&itemId=${itemId}`;
                    } else {
                        $result.innerText = '문의 작성에 실패하였습니다.';
                        $result.style.color = 'red';
                    }
                }
            }
        };
        xhr.open('POST', '/goods/inquiry'); // 요청 URL 설정
        xhr.send(formData);
        $result.innerText = '';
    }
});
