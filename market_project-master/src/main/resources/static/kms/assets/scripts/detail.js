document.addEventListener("DOMContentLoaded", function () {
    // '닫기' 버튼 (첫 번째, 두 번째)
    const firstCloseButton = document.querySelectorAll('.goods-close-button')[0];
    const secondCloseButton = document.querySelectorAll('.goods-close-button')[1];

    document.querySelectorAll('.goods-close-button').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
        });
    });

    // 첫 번째 버튼: 7, 15, 21번째 div 토글
    if (firstCloseButton) {
        firstCloseButton.addEventListener('click', function () {
            const targetDivs = [
                document.querySelectorAll('.goods-guide-change2')[0],
                document.querySelectorAll('.goods-guide-change2')[1],
                document.querySelectorAll('.goods-guide-change2')[2]
            ];

            targetDivs.forEach(div => div.classList.toggle('hidden'));

            if (firstCloseButton.textContent.trim() === "닫기") {
                firstCloseButton.textContent = "자세히보기";
                firstCloseButton.classList.replace('arrow-up', 'arrow-down');
            } else {
                firstCloseButton.textContent = "닫기";
                firstCloseButton.classList.replace('arrow-down', 'arrow-up');
            }
        });
    }

    // 두 번째 버튼: 33, 42번째 div 토글
    if (secondCloseButton) {
        secondCloseButton.addEventListener('click', function () {
            const targetDivs = [
                document.querySelectorAll('.goods-guide-change2')[3],
                document.querySelectorAll('.goods-guide-change2')[4]
            ];

            targetDivs.forEach(div => div.classList.toggle('hidden'));

            if (secondCloseButton.textContent.trim() === "닫기") {
                secondCloseButton.textContent = "자세히보기";
                secondCloseButton.classList.replace('arrow-up', 'arrow-down');
            } else {
                secondCloseButton.textContent = "닫기";
                secondCloseButton.classList.replace('arrow-down', 'arrow-up');
            }
        });
    }

    // 모든 'goods-nav-a' 링크에서 클릭 이벤트 처리
    document.querySelectorAll('.goods-nav-a').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // 기본 동작(페이지 이동)을 방지하고 커스텀 처리

            // 이전 클릭된 상태를 초기화
            document.querySelectorAll('.goods-nav-a').forEach(a => a.classList.remove('clicked'));

            // 현재 클릭한 요소에 'clicked' 클래스 추가
            event.currentTarget.classList.add('clicked');

            // 선택한 앵커로 이동 (기본 동작 실행)
            const targetId = event.currentTarget.getAttribute('href');
            if (targetId.startsWith('#')) {
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 섹션 ID와 네비게이션 a 태그 매칭
    const sections = document.querySelectorAll('#description, #detail, #review, #inquiry');
    const navLinks = document.querySelectorAll('.goods-nav-a');

// 현재 활성화된 섹션 ID 추적
    let activeSection = null;

// IntersectionObserver 옵션 설정
    const observerOptions = {
        root: null,               // 뷰포트 기준
        rootMargin: '-50% 0px -50% 0px', // 섹션의 중앙 기준
        threshold: 0,             // 섹션 경계만 넘어도 이벤트 발생
    };

// IntersectionObserver 콜백
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            const targetId = entry.target.id; // 현재 감지된 섹션 ID
            const targetLink = document.querySelector(`a[href="#${targetId}"]`);

            if (entry.isIntersecting) {
                // 활성화된 섹션 업데이트
                if (activeSection !== targetId) {
                    // 모든 링크에서 'clicked' 클래스 제거
                    navLinks.forEach(link => link.classList.remove('clicked'));

                    // 현재 활성화된 섹션의 링크에 'clicked' 클래스 추가
                    targetLink.classList.add('clicked');

                    // 활성화된 섹션 ID 업데이트
                    activeSection = targetId;
                }
            }
        });
    };

// IntersectionObserver 생성
    const observer = new IntersectionObserver(observerCallback, observerOptions);

// 각 섹션에 IntersectionObserver 적용
    sections.forEach(section => observer.observe(section));

// 클릭 이벤트 처리
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // 기본 앵커 동작 방지

            // 클릭한 앵커의 href 속성 값 가져오기
            const targetId = event.currentTarget.getAttribute('href').replace('#', '');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // 스크롤 위치 설정
                const offset = 10; // 상단 여백
                const targetPosition = targetElement.offsetTop - offset;

                // 부드러운 스크롤 이동
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });

                // 모든 링크에서 'clicked' 클래스 제거
                navLinks.forEach(a => a.classList.remove('clicked'));

                // 현재 클릭한 링크에 'clicked' 클래스 추가
                event.currentTarget.classList.add('clicked');
            }
        });
    });

    // 하트 버튼
    const heartButton = document.getElementById('heartButton');
    const heartIcon = document.getElementById('heartIcon');

    heartButton.addEventListener('click', function () {
        // 현재 하트 아이콘이 빨간색인지를 확인
        if (heartIcon.classList.contains('filled')) {
            // 빨간 하트를 기본 하트로 변경
            heartIcon.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0yNS44MDcgNy44NjNhNS43NzcgNS43NzcgMCAwIDAtOC4xNzIgMEwxNiA5LjQ5N2wtMS42MzUtMS42MzRhNS43NzkgNS43NzkgMCAxIDAtOC4xNzMgOC4xNzJsMS42MzQgMS42MzQgNy40NjYgNy40NjdhMSAxIDAgMCAwIDEuNDE1IDBzMCAwIDAgMGw3LjQ2Ni03LjQ2N2gwbDEuNjM0LTEuNjM0YTUuNzc3IDUuNzc3IDAgMCAwIDAtOC4xNzJ6IiBzdHJva2U9IiM1RjAwODAiIHN0cm9rZS13aWR0aD0iMS42IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
            heartIcon.classList.remove('filled'); // 클래스 제거
        } else {
            // 기본 하트를 빨간 하트로 변경
            heartIcon.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0yNS44MDcgNy44NjNhNS43NzcgNS43NzcgMCAwIDAtOC4xNzIgMEwxNiA5LjQ5N2wtMS42MzUtMS42MzRhNS43NzkgNS43NzkgMCAxIDAtOC4xNzMgOC4xNzJsMS42MzQgMS42MzQgNy40NjYgNy40NjdhMSAxIDAgMCAwIDEuNDE1IDBzMCAwIDAgMGw3LjQ2Ni03LjQ2N2gwbDEuNjM0LTEuNjM0YTUuNzc3IDUuNzc3IDAgMCAwIDAtOC4xNzJ6IiBmaWxsPSIjRkY1QTVBIiBzdHJva2U9IiNGRjVBNUEiIHN0cm9rZS13aWR0aD0iMS42IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
            heartIcon.classList.add('filled'); // 클래스 추가
        }
    });

    // 알림 버튼
    const buttons = document.querySelectorAll(".goods-notification-button");
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const targetElement = button.parentElement.nextElementSibling;

            if (targetElement && targetElement.tagName.toLowerCase() === "p") {
                targetElement.style.display = targetElement.style.display === "block" ? "none" : "block";
            }
        });
    });

    const deleteButtons = document.querySelectorAll('.review-delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const reviewIndex = button.getAttribute('data-index');
            if (!reviewIndex) {
                alert("잘못된 요청입니다.");
                return;
            }

            if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const response = JSON.parse(xhr.responseText);
                            if (response.result === 'success') {
                                alert('리뷰가 삭제되었습니다.');
                                button.closest('.goods-review-member').style.display = 'none';
                            } else {
                                alert('리뷰 삭제에 실패했습니다.');
                            }
                        } else {
                            alert('삭제에 실패했습니다.');
                        }
                    }
                };
                xhr.open('DELETE', `/goods/delete?index=${reviewIndex}`);
                xhr.send();
            }
        });
    });

    const decreaseBtn = document.getElementById('decreaseBtn');
    const increaseBtn = document.getElementById('increaseBtn');
    const quantityDiv = document.getElementById('quantity');
    const priceSpan = document.getElementById('dcPrice');
    const totalPriceSpan = document.getElementById('totalPrice');

    // 초기값 설정
    const dcPrice = parseInt(priceSpan.dataset.dcprice.replace(/,/g, ''), 10); // 쉼표 제거 후 숫자로 변환
    let quantity = 1;

// 초기 총 상품 금액 설정
    totalPriceSpan.textContent = (dcPrice * quantity).toLocaleString();

// 버튼 클릭 이벤트
    increaseBtn.addEventListener('click', () => {
        quantity += 1; // 수량 증가
        quantityDiv.textContent = quantity; // 수량 표시 업데이트
        totalPriceSpan.textContent = (dcPrice * quantity).toLocaleString(); // 총 상품 금액 업데이트
        decreaseBtn.disabled = false; // - 버튼 활성화
    });

    decreaseBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity -= 1; // 수량 감소
            quantityDiv.textContent = quantity; // 수량 표시 업데이트
            totalPriceSpan.textContent = (dcPrice * quantity).toLocaleString(); // 총 상품 금액 업데이트

            // 수량이 1일 때 - 버튼 비활성화
            if (quantity === 1) {
                decreaseBtn.disabled = true;
            }
        }
    });
});



// 모달 처리
function openModal(button) {
    const imageSrc = button.getAttribute('data-image-src');
    const writer = button.getAttribute('data-writer');
    const title = button.getAttribute('data-title');
    const content = button.getAttribute('data-content');
    const createdAt = button.getAttribute('data-createdAt');

    // 모달창에 데이터 삽입
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('modal-writer').textContent = writer;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-content').textContent = content;
    document.getElementById('modal-createdAt').textContent = createdAt;

    // 모달 열기
    document.getElementById('reviewModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('reviewModal').style.display = 'none';
}

// 장바구니 담기 버튼
const $cartButton3 = document.getElementById('cart-button3');
$cartButton3.addEventListener('click', () => {
    const $itemId = document.getElementById('itemId');
    const $count = document.getElementById('quantity');
    const $packaging = document.getElementById('packaging');
    const formData = new FormData();
    formData.append('itemId', $itemId.value);
    formData.append('itemStatus', $packaging.innerHTML);
    formData.append('quantity', $count.innerHTML);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            alert('오류');
            return;
        }
        const response = JSON.parse(xhr.responseText);
        if (response["result"] === 'success') {
            const $result = '상품을 장바구니에 담았습니다.';
            Dialog.show({
                content: $result,
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
        } else {
            const $result = `상품을 장바구니에 담지 못했습니다.<br>잠시 후 다시 시도해 주세요.`;
            Dialog.show({
                content: $result,
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
        }

    };
    xhr.open('POST', '/cart/in');
    xhr.send(formData);
});