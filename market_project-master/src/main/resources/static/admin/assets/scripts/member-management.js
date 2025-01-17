const $approveButton = document.querySelector('.approve');
const $suspendedButton = document.querySelector('.suspended');
const $modifyButton = document.querySelector('.modify');

$approveButton.onclick = () => {
    $suspendedButton.classList.remove('active');
    $approveButton.classList.add('active');
};

$suspendedButton.onclick = () => {
    $approveButton.classList.remove('active');
    $suspendedButton.classList.add('active');
};



$modifyButton.onclick = () => {
    const $id = document.querySelector('.id');
    let $isSuspended
    if($approveButton.classList.contains('active')){
        $isSuspended = 'false';
    }
    if($suspendedButton.classList.contains('active')){
        $isSuspended = 'true';
    }
    const formData = new FormData();
    formData.append('id', $id.innerHTML);
    formData.append("isSuspended", $isSuspended);
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
        if(response['result'] === 'success'){
            Dialog.show({
                content: '수정되었습니다.',
                buttons: [{
                    text: '확인', onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
        } else {
            Dialog.show({
                content: `수정에 실패했습니다.<br>잠시 후 다시 시도해 주세요.`,
                buttons: [{
                    text: '확인', onclick: ($dialog) => Dialog.hide($dialog)
                }]
            });
        }

    };
    xhr.open('PATCH', '/admin/modify-suspended');
    xhr.send(formData);
}