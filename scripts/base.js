$(document).ready(() => {
    inputFunction();
});

/*START: Input*/
function inputFunction() {
    var ele;
    /*Note: To remove error message from input*/
    $(document).on('click', '.form-input', function () {
        ele = $(this);
        ele.closest('.form-group').removeClass('error');
    });
}
/*END: Input*/

/*START: Learn More*/
function showModal(modalName) {
    $('.bg-overlay').addClass('show');
    $(modalName).addClass('show');
}
/*END: Learn More*/

/*END:Hide Modal*/
function hideModal() {
    $('.bg-overlay, .modal').removeClass('show');
}
/*END: Hide Modal*/
