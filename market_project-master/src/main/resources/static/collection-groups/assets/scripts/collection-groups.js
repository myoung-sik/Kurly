const $items = document.querySelectorAll('#main > .top > .menu > .item');

$items.forEach((x) => x.addEventListener('mouseenter', () => {
    x.classList.add('hover');
    x.addEventListener('mouseleave', () => {
        $items.forEach((x) => x.classList.remove('hover'));
    });
}));

const $filterBox = document.querySelectorAll('.container > .content-box > .filter > .filter-area > .filter-box');

$filterBox.forEach((x) => {
    const $button = x.querySelector(':scope > .filter-button');
    const $nav = x.querySelector(':scope > .nav');
    $nav.style.opacity = '1';

    $button.onclick = () => {
        if($nav.style.opacity === '1'){
            $button.querySelector(':scope > .svg').style.transform = 'rotate(180deg)';
            $nav.style.opacity = '0';
            $nav.style.maxHeight = '0';
        } else {
            $button.querySelector(':scope > .svg').style.transform = 'rotate(0deg)';
            $nav.style.opacity = '1';
            $nav.style.maxHeight = '100vh';
        }
    };
});


const $menuList = Array.from(document.querySelectorAll('#nav > .header-wrapper > ul > .item1 > a'));
const $title = document.querySelector('.top > .title');
$menuList.forEach((x) => {
    if($title.innerText === x.innerText){
        x.classList.add('active');
    }
});

const $cartInButton = document.querySelectorAll('#main > .container > .content-box > .item-box > .item-container > .item > .button-wrapper > .button');
const reg = new RegExp(/\([^)]+\)/gi);

$cartInButton.forEach((x) => x.onclick = (e) => {
    e.preventDefault();
    const $img = x.parentElement.parentElement.querySelector(':scope > .img-wrapper > .wrapper2 > .wrapper3 > .image');
    const $title = x.parentElement.parentElement.querySelector(':scope > .desc-wrapper > .title');
    const $price = x.parentElement.parentElement.querySelector(':scope > .desc-wrapper > .discount-price > .dimmed-price > .price-number');
    const $salesPrice = x.parentElement.parentElement.querySelector(':scope > .desc-wrapper > .discount-price > .discount > .sales-price > .price-number');
    const $itemId = x.parentElement.parentElement.querySelector(':scope  > .desc-wrapper > label > .item-id');
    const $itemStatus = x.parentElement.parentElement.querySelector(':scope  > .desc-wrapper > label > .item-status');

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