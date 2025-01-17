new Swiper('.swiper', {
    slidesPerView: 4,
    slidesPerGroup: 4,
    speed: 500,


    navigation: {
        prevEl: '.prev',
        nextEl: '.next',
    },
});

new Swiper('.swiper2', {
    slidesPerView: 5,
    slidesPerGroup: 5,
    speed: 500,
    spaceBetween: 23.5,

    navigation: {
        prevEl: '.prev2',
        nextEl: '.next2',
    },
});

new Swiper('.swiper3', {
    slidesPerView: 5,
    speed: 500,
    spaceBetween: 23.5,
    loop: true,

    autoplay: {
        delay: 900,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },

    navigation: {
        prevEl: '.prev3',
        nextEl: '.next3',
    },
});


const $cartBtn = document.querySelectorAll('.slide-container > .swiper > .swiper-wrapper > .swiper-slide > .link > .button-wrapper > button');
const $cartBtn2 = document.querySelectorAll('.slide-container > .swiper-initialized > .wrapper2 > .slide2 > .link > .button-wrapper2 > button')
const reg = new RegExp(/\([^)]+\)/gi);

$cartBtn.forEach((x) => x.onclick = (e) => {
    e.preventDefault();
    const $img = x.parentElement.parentElement.querySelector(':scope > .img-wrapper > .img-box > .img-box2 > span > img');
    const $title = x.parentElement.parentElement.querySelector(':scope  > .product-info > .product-name');
    const $price = x.parentElement.parentElement.querySelector(':scope > .product-info > .content-row > .product-price > div > .dimmed-price > .price-number');
    const $salesPrice = x.parentElement.parentElement.querySelector(':scope > .product-info > .content-row > .product-price > .discount > .sales-price > .price-number');
    const $itemId = x.parentElement.parentElement.querySelector(':scope  > .product-info > label > .item-id');
    const $itemStatus = x.parentElement.parentElement.querySelector(':scope  > .product-info > label > .item-status');

    CartDialog.show({
        img: $img.src,
        title: $title.textContent,
        content: $title.textContent.replace(reg, '').trim(),
        price: `${$price.textContent}원`,
        salesPrice: `${$salesPrice.textContent}원`,
        total: '합계',
        totalPrice: `${$salesPrice.textContent}`,
        buttons: [{
            text: '취소',
            onclick: ($dialog) => {
                CartDialog.hide($dialog);
            }
        }, {
            text: '장바구니 담기',
            onclick: ($dialog) => {
                const count = document.querySelector('.---cartDialog > ._div2 > ._div20 > ._div23 > ._count');
                const formData = new FormData();
                formData.append('itemId', $itemId.value);
                formData.append('itemStatus', $itemStatus.value);
                formData.append('quantity', count.innerHTML);

                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== XMLHttpRequest.DONE){
                        return;
                    }
                    if (xhr.status < 200 || xhr.status >= 300) {
                        alert('오류');
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    if (response['result'] === 'failure') {
                        Dialog.show({
                            content: `로그인 하셔야 본 서비스를 이용하실 수 있습니다.`,
                            buttons: [{
                                text: '확인',
                                onclick: ($dialog) => Dialog.hide($dialog)
                            }]
                        })
                    }
                };
                xhr.open('POST', '/cart/in');
                xhr.send(formData);
                CartDialog.hide($dialog);
            }
        }]
    });
    CartDialog.plusMinus();
});

$cartBtn2.forEach((x) => x.onclick = (e) => {
    e.preventDefault();
    const $img2 = x.parentElement.parentElement.querySelector(':scope > .img-wrapper > .img-box > .img-box2 > span > img');
    const $title2 = x.parentElement.parentElement.querySelector(':scope  > .img-wrapper > .product-info2 > .content > .title');
    const $price2 = x.parentElement.parentElement.querySelector(':scope > .img-wrapper > .product-info2 > .content > .product-price > div > .dimmed-price > .price-number');
    const $salesPrice2 = x.parentElement.parentElement.querySelector(':scope > .img-wrapper > .product-info2 > .content > .product-price > .discount > .sales-price > .price-number');
    const $itemId2 = x.parentElement.parentElement.querySelector(':scope  > .img-wrapper > .product-info2 > .content > label > .item-id');
    const $itemStatus2 = x.parentElement.parentElement.querySelector(':scope  > .img-wrapper > .product-info2 > .content > label > .item-status');

    CartDialog.show({
        img: $img2.src,
        title: $title2.textContent,
        content: $title2.textContent.replace(reg, '').trim(),
        price: `${$price2.textContent}원`,
        salesPrice: `${$salesPrice2.textContent}원`,
        total: '합계',
        totalPrice: `${$salesPrice2.textContent}`,
        buttons: [{
            text: '취소',
            onclick: ($dialog) => {
                CartDialog.hide($dialog);
            }
        }, {
            text: '장바구니 담기',
            onclick: ($dialog) => {
                const count2 = document.querySelector('.---cartDialog > ._div2 > ._div20 > ._div23 > ._count');
                const formData = new FormData();
                formData.append('itemId', $itemId2.value);
                formData.append('itemStatus', $itemStatus2.value);
                formData.append('quantity', count2.innerHTML);

                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== XMLHttpRequest.DONE){
                        return;
                    }
                    if (xhr.status < 200 || xhr.status >= 300) {
                        alert('오류');
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    if (response['result'] === 'failure') {
                        Dialog.show({
                            content: `로그인 하셔야 본 서비스를 이용하실 수 있습니다.`,
                            buttons: [{
                                text: '확인',
                                onclick: ($dialog) => Dialog.hide($dialog)
                            }]
                        })
                    }
                    if(response['result'] === 'success'){
                        Dialog.show({
                            content: `장바구니에 담았습니다.`,
                            buttons: [{
                                text: '확인',
                                onclick: ($dialog) => Dialog.hide($dialog)
                            }]
                        })
                    }
                };
                xhr.open('POST', '/cart/in');
                xhr.send(formData);
                CartDialog.hide($dialog);
            }
        }]
    });

    CartDialog.plusMinus();
});

