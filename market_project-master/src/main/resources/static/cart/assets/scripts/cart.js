const $main = document.getElementById('main');
const $list = document.getElementById('list');
const $itemContainer = document.getElementById('item-container');
const $pay = document.getElementById('pay');


// 이벤트 리스너 추가
document.querySelectorAll('.plus').forEach(button => {
    button.addEventListener('click', event => updateQuantity(event, 'plus'));
});
document.querySelectorAll('.minus').forEach(button => {
    button.addEventListener('click', event => updateQuantity(event, 'minus'));
});
document.querySelectorAll('.checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', calculateTotal);
});



// 전체선택 기능 구현
function selectAll(selectAll) {
    const $checkboxes = document.getElementsByName('check');
    $checkboxes.forEach((checkbox) => {

        // after
        if (checkbox.checked !== selectAll.checked) {
            checkbox.checked = selectAll.checked;
            sendCheckboxStatus(checkbox);
        }

        // after
    });
    calculateTotal();
}

// 개별 checkbox 클릭 이벤트 추가
document.addEventListener('DOMContentLoaded', () => {
    // 체크박스 초기 상태에 따라 총합 계산
    document.querySelectorAll('.checkbox').forEach(checkbox => {
        const currentItem = checkbox.closest('.item');
        if (!currentItem) {
            return;
        }
        const itemIdElement = currentItem.querySelector('.id');
        const itemPriceElement = currentItem.querySelector('.itemPrice');
        if (!itemIdElement || !itemPriceElement) {
            return;
        }

        // 초기 체크 상태 기반으로 동작
        if (checkbox.checked) {
            const itemPriceElement = currentItem.querySelector('.itemPrice');
            const itemPrice = parseInt(itemPriceElement.innerText.replace(/[^0-9]/g, ''), 10);


            // 총합 계산 초기화
            if (!isNaN(itemPrice)) {
                checkbox.dataset.price = itemPrice;
            }
        }

        checkbox.addEventListener('change', function () {
            const allCheckboxes = document.querySelectorAll('.checkbox');
            const isAllChecked = Array.from(allCheckboxes).every(cb => cb.checked);

            const selectAllCheckbox = document.querySelector('input[value="selectAll"]');
            selectAllCheckbox.checked = isAllChecked;

            sendCheckboxStatus(this);
            calculateTotal();

        });
    });
    calculateTotal(); // 초기 총합 계산

    // 선택삭제 기능 구현
    const $deleteButton = document.querySelector('.delete-button');
    $deleteButton.addEventListener('click', () => {
        Dialog2.showDialog({
            message: "선택한 상품을 삭제하시겠습니까?",
            onConfirm: () => {
                const $selectedItems = [];
                document.querySelectorAll('.checkbox').forEach(checkbox => {
                    const currentItem = checkbox.closest('.item');
                    if (!currentItem) return;

                    const isChecked = checkbox.checked; // 체크 여부
                    const itemIndexElement = currentItem.querySelector('.index');

                    if (isChecked && itemIndexElement) {
                        $selectedItems.push(itemIndexElement.value);
                    }
                });
                if ($selectedItems.length === 0) {
                    alert("삭제할 항목을 선택해주세요.");
                    return;
                }

                const xhr = new XMLHttpRequest();
                // FormData 생성
                const formData = new FormData();
                $selectedItems.forEach(index => formData.append('indices', index));
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== XMLHttpRequest.DONE) {
                        return;
                    }
                    if (xhr.status < 200 || xhr.status >= 300) {
                        alert('에러');
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    if (response['result'] === 'error') {
                        alert(`Error: ${response['error']}`);
                        return;
                    }
                    location.reload();
                    calculateTotal(); // 총합 재계산
                };
                xhr.open('DELETE', '/cart/deleteSelectedItems');
                xhr.send(formData);
            },
            onCancel: () => {
                // 취소 버튼 클릭 시 아무 동작도 하지 않음
            }
        });
    });
});

// 개별 checkbox 상태 변경 시 호출
function sendCheckboxStatus(checkbox) {
    const currentItem = checkbox.closest('.item');
    if (!currentItem) {
        return;
    }
    const indexElement = currentItem.querySelector('.index');
    if (!indexElement) {
        return;
    }
    const index = indexElement.value ? indexElement.value.trim() : null;
    const isChecked = checkbox.checked ? 1 : 0;

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('index', index);
    formData.append('isChecked', isChecked);
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {

            return;
        }
        const response = JSON.parse(xhr.responseText);
        if (response['result'] === 'error') {
            alert(`Error: ${response['error']}`);
        }

    };
    xhr.open('POST', '/cart/updateCheck');
    xhr.send(formData);
}



// 전체선택 서버 구현
document.addEventListener('DOMContentLoaded', () => {
    const allSelectCheckbox = document.querySelector('input[value="selectAll"]'); // 전체 선택
    const deliveryCheckbox = document.querySelector('.Delivery-checkbox'); // 샛별 배송
    const itemCheckboxes = document.querySelectorAll('.checkbox'); // 개별 항목 체크박스
    // 체크박스 상태 동기화
    function syncCheckboxes() {
        const isAnyUnchecked = Array.from(itemCheckboxes).some(checkbox => !checkbox.checked);

        // 전체 선택 및 샛별 배송 체크박스 상태 변경
        allSelectCheckbox.checked = !isAnyUnchecked;
        deliveryCheckbox.checked = !isAnyUnchecked;
    }
    // 샛별배송 체크박스 클릭 시 동작
    deliveryCheckbox.addEventListener('change', () => {
        const isChecked = deliveryCheckbox.checked;

        // 모든 체크박스 상태를 샛별배송 체크박스와 동기화
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            sendCheckboxStatus(checkbox); // 서버로 상태 전송
            updatePayButtonState();
        });

        // 전체 선택 체크박스 동기화
        allSelectCheckbox.checked = isChecked;
        calculateTotal(); // 총합 재계산
    });

    // 개별 체크박스 변경 시 호출
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            sendCheckboxStatus(checkbox); // 서버로 상태 동기화
            syncCheckboxes(); // 전체 선택 및 샛별 배송 상태 동기화
            calculateTotal(); // 총합 재계산
        });
    });

    // 페이지 로드 시 초기 상태 설정
    function initializeCheckboxes() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {

                return;
            }

            const response = JSON.parse(xhr.responseText);
            const checkboxStatus = response['checkboxStatus'];
            const isAllChecked = response['isAllChecked'];
            const isDeliveryChecked = response['isDeliveryChecked'];

            document.querySelectorAll('.checkbox').forEach(checkbox => {
                const index = checkbox.dataset.index;
                if (checkboxStatus[index] !== undefined) {
                    checkbox.checked = checkboxStatus[index];
                }
            });

            allSelectCheckbox.checked = isAllChecked;
            deliveryCheckbox.checked = isDeliveryChecked;

            // 전체 선택 및 샛별배송 체크박스 상태 동기화
            syncCheckboxes();

            calculateTotal(); // 초기 총합 계산
        };
        xhr.open('GET', '/cart/getCheckboxStatus');
        xhr.send();
    }
    initializeCheckboxes(); // 초기화 호출
});

// 총합 계산
function calculateTotal() {
    const formData = new FormData();
    let totalItemPrice = 0;

    document.querySelectorAll('.item').forEach(item => {
        const checkbox = item.querySelector('.checkbox');
        if (!checkbox) {
            console.warn("Warning: Checkbox not found in item", item);
            return;
        }
        if (checkbox && checkbox.checked) {
            const $indexElement  = item.querySelector('.id');
            const $itemPriceElement = item.querySelector('.itemPrice');
            if ($indexElement  || $itemPriceElement) {
                const $index = $indexElement .value.trim();
                const $itemPrice = parseInt($itemPriceElement.innerText.replace(/[^0-9]/g, ''), 10);
                console.log()
                formData.append('index', $index);
                formData.append('itemPrice', $itemPrice.toString());
                totalItemPrice += $itemPrice;
            }
        }
    });

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {

            return;
        }

        const response = JSON.parse(xhr.responseText);
        if (response['result'] === 'error') {
            alert(`Error: ${response['error']}`);
            return;
        }
        const totalPrice = response['totalPrice'] || 0;

        updateUI(totalPrice);


        function updateUI(totalPrice) {
            const priceText = `${totalPrice.toLocaleString()} 원`;
            // 로그인 여부 확인
            const isLoggedIn = document.querySelector('a[href="/member/login"]') === null;

            // 로그인 상태에 따라 버튼 텍스트 설정
            const buttonText = isLoggedIn
                ? (totalPrice > 0 ? `${priceText} 주문하기` : "상품을 선택해주세요")
                : "로그인";

            document.querySelector('.pay > .price').innerText = priceText;
            document.querySelector('.total-pay > .price').innerText = priceText;
            document.querySelector('.pay-button').innerText = buttonText;

            if (totalPrice === 0) {
                document.querySelector('.items-price > ._text').innerText = `상품 0 원 + 배송비 무료`;
                document.querySelector('.total-price').innerText = "0 원";
            } else {
                document.querySelector('.items-price > ._text').innerText = `상품 ${totalPrice.toLocaleString()} 원 + 배송비 무료`;
                document.querySelector('.total-price').innerText = priceText;
            }


        }


    };
    xhr.open('POST', '/cart/totalPrice');
    xhr.send(formData);
}


const $payButton = document.querySelector('.pay-button');
const $deleteButton = document.querySelector('.delete-button');

function updatePayButtonState() {
    const $hasItems = document.querySelectorAll('.item').length > 0;
    const $hasCheckedItems = Array.from(document.querySelectorAll('.checkbox')).some(checkbox => checkbox.checked);
    const isLoggedIn = document.querySelector('a[href="/member/login"]') === null;

    // 버튼 상태 즉시 업데이트
    if ($hasCheckedItems && $hasItems && isLoggedIn) {
        $deleteButton.classList.remove('no-deleteButton');
        $payButton.classList.remove('disabled');
        $deleteButton.disabled = false;
        $payButton.disabled = false;
    } else {
        $deleteButton.classList.add('no-deleteButton');
        $payButton.classList.add('disabled');
        $deleteButton.disabled = true;
        $payButton.disabled = true;
    }


    // 서버에 상태 요청 (비동기)
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {

            return;
        }
        const response = JSON.parse(xhr.responseText);
        const hasItems = response['hasItems'];
        const hasCheckedItems = response['hasCheckedItems'];

        // 선택 삭제 버튼 상태, 결제 버튼 상태
        if (hasCheckedItems && hasItems && isLoggedIn) {
            $deleteButton.classList.remove('no-deleteButton');
            $payButton.classList.remove('disabled');
            $deleteButton.disabled = false;
            $payButton.disabled = false;
        } else {
            $deleteButton.classList.add('no-deleteButton');
            $payButton.classList.add('disabled');
            $deleteButton.disabled = true;
            $payButton.disabled = true;
        }


    };
    xhr.open('GET', '/cart/getCartStatus');
    xhr.send()
}

function onCheckboxChange() {
    sendCheckboxStatus(this); // 체크박스 상태 서버 전송
    updatePayButtonState();   // 버튼 상태 업데이트
    calculateTotal();         // 총합 계산
}

// 초기 상태 업데이트
function initializeCart(){
    calculateTotal();
    updatePayButtonState()
}
// 체크박스 및 삭제 버튼에 이벤트 리스너 등록
document.querySelectorAll('.checkbox').forEach((checkbox) => {
    checkbox.removeEventListener('change', onCheckboxChange);
    checkbox.addEventListener('change', onCheckboxChange);
    checkbox.addEventListener('change', () => {
        sendCheckboxStatus(checkbox);
        updatePayButtonState();
        initializeCart();
    });
});
updatePayButtonState(); // 버튼 상태 초기화
calculateTotal();       // 총합 초기화
document.querySelectorAll('.cancel-button').forEach((button) => {
    button.addEventListener('click', initializeCart);
});

// 버튼 클릭 이벤트
$payButton.addEventListener('click', () => {
    if (!$payButton.disabled) {
        window.location.href = '/pay/';
    }
});
//초기화 호출
document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
});


// 플러스와 마이너스 총괄 관리
{
    function updateQuantity(event, type) {
        const currentItem = event.currentTarget.closest('.item');
        const index = currentItem.querySelector('.index').value;
        const quantityElement = currentItem.querySelector('.quantity > .num');
        const itemPriceElement = currentItem.querySelector('.itemPrice');

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('index', index);
        formData.append('itemQuantity', quantityElement.innerText);

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {

                return;
            }
            const response = JSON.parse(xhr.responseText);
            if (response['result'] === 'error') {
                alert(`Error: ${response['error']}`);
                return;
            }
            const updatedQuantity = response['result'];
            const basePrice = parseInt(itemPriceElement.getAttribute('data-price'), 10);
            const updatedPrice = basePrice * updatedQuantity;

            quantityElement.innerText = updatedQuantity;
            itemPriceElement.innerText = `${updatedPrice.toLocaleString()} 원`;

            calculateTotal(); // 수량 변경 후 총합 재계산

        };
        xhr.open('POST', `/cart/${type}`);
        xhr.send(formData);
    }
}



// 페이지 로드 시 총합 초기화
document.addEventListener('DOMContentLoaded', calculateTotal);

// 상품 삭제 구현
{
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.cancel-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const currentItem = event.currentTarget.closest('.item');
                const index = currentItem.querySelector('.index').value;

                if (!index) {
                    console.error('Item ID를 찾을 수 없습니다.');
                    return;
                }

                // 다이얼로그 표시
                Dialog2.showDialog({
                    onConfirm: () => {
                        button.disabled = true; // 중복 요청 방지
                        // DELETE 요청 전송
                        const xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState !== XMLHttpRequest.DONE) {
                                return;
                            }
                            if (xhr.status < 200 || xhr.status >= 300) {
                                alert('오류');
                                return;
                            }
                            button.disabled = false;
                            const response = JSON.parse(xhr.responseText);
                            if (response['result'] === 'error') {
                                alert(`Error: ${response.error}`);
                                return;
                            }
                            // UI에서 항목 제거
                            currentItem.remove();

                            // 남은 아이템 확인
                            const items = document.querySelectorAll('.item');
                            if (items.length === 0) {
                                location.reload();
                            } else {
                                calculateTotal(); // 총합 재계산
                            }

                        };

                        xhr.open('DELETE', `/cart/deleteItem?index=${index}`);
                        xhr.send();
                    },
                    onCancel: () => {
                        console.log('Deletion cancelled'); // 취소 시 로직
                    }
                });
            });
        });
    });
}

const $changeButton = document.querySelector('.change-button');
$changeButton.onclick = () => {
    window.location.href = '/mypage/info';
};