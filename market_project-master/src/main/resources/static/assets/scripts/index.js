
//배너
let currentSlide = 0;
const slides = document.querySelectorAll('#main > .banner-container > .slide-wrapper > .slide');
const slideCount = slides.length;

function showSlide(n) {
    slides.forEach(slide => slide.style.display = 'none');
    slides[n].style.display = 'block';
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    showSlide(currentSlide);
}

document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide);
    setInterval(nextSlide, 3000); // 3초마다 자동 슬라이드

    if(!sessionStorage.getItem("dialogShown")) {
        Dialog.show({
            content: `이 사이트는 마켓컬리를 클론 코딩한 웹사이트 입니다.<br>결제, 배송과 같은 실제 서비스는 제공되지 않으니<br>이점 유의 바랍니다.`,
            buttons: [{
                text: '확인',
                onclick: ($dialog) => Dialog.hide($dialog)
            }]
        });
        sessionStorage.setItem("dialogShown", "true");
    }

});



