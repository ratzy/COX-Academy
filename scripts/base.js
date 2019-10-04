var formEmpty = true;
$(document).ready(() => {
    inputFunction();
    showUserActivity();
    logIn();
    logOut();
    selectTech();
});

/*START: Input*/
function inputFunction() {
    var ele, inputVal;
    /*Note: To check the input value null or not | UI logic*/
    $(document).on('focusout change input', '.form-input', function () { //'focusout focusin click keyup'
        ele = $(this);
        inputVal = ele.val();
        if (inputVal.length) {
            ele.closest('.form-group').removeClass('error').addClass('has-value');
        } else {
            ele.closest('.form-group').removeClass('has-value').addClass('error');
        }
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

/*START: Show Loader*/
function showLoader() {
    $('.bg-overlay, .loader-wrapper').addClass('show');
}
/*END: Show Loader*/

/*START: Hide Loader*/
function hideLoader() {
    $('.bg-overlay, .loader-wrapper').removeClass('show');
}
/*END: Hide Loader*/

/*START: Hide Hero*/
function hideHero() {
    $('.hero-wrapper').addClass('hide');
}
/*END: Hide Hero*/

/*START: Show Hero*/
function showHero() {
    $('.hero-wrapper').removeClass('hide');
}
/*END: Show Hero*/

/*START: Showing Dashboard*/
function showDashboard() {
    $('header').addClass('show');
    $('.test-selection-wrapper').addClass('show');
    $('.test-selection-body .technology-item').removeClass('selected'); // Resetting previous selection
    $('.test-selection-footer').removeClass('show'); // Hiding footer option
}
/*END: Showing Dashboard*/

/*START: Hiding Dashboard*/
function hideDashboard() {
    $('header').removeClass('show');
    $('.test-selection-wrapper').removeClass('show');
    $('.test-screen').removeClass('show');
}
/*END: Hiding Dashboard*/

/*START: Show User Profile Activity from Header*/
function showUserActivity() {
    var ele;
    $(document).on('click', '.user-info', function () {
        ele = $(this);
        ele.closest('.user-profile-wrapper').toggleClass('show');
    });

    /*NOTE: Closing the wrapper on selection*/
    $(document).on('click', '.user-profile-item', function () {
        ele = $(this);
        ele.closest('.user-profile-wrapper').removeClass('show');
    });

}
/*END: Show User Profile Activity from Header*/

/*START: Login*/
function logIn() {
    var ele, inputVal;
    var loginRequestArr = [];

    $(document).on('click', '.hero-wrapper .login-btn', function () {
        ele = $(this);
        ele.closest('.hero-form-wrapper').find('.form-group').each(function () {
            ele = $(this);
            inputVal = ele.find('.form-input').val();
            if (inputVal.length) {
                formEmpty = false;
                loginRequestArr.push(inputVal); //Pushing to the array
            } else {
                ele.addClass('error');
                formEmpty = true;
            }
        });

        //Checking if form is not empty
        if (!formEmpty) {
            //NOTE: After validation of null call this function along with the API call for login validation
            getQuestionSet();
        }

    });
}
/*END: Login*/

/*START: Fetch QuestionSet*/
function getQuestionSet() {
    showLoader();
    $.ajax({
        url: 'assets/data/CoxAcademyQuestions.json',
        type: 'get',
        dataType: 'json',
        contentType: 'application/json'
    }).pipe(
        function (returnData) {
            if (returnData && returnData.CoxAcademyQuestions && returnData.CoxAcademyQuestions.responseHeader && returnData.CoxAcademyQuestions.responseHeader.successFlag && returnData.CoxAcademyQuestions.responseHeader.successFlag.toLowerCase() === 'true') {
                // TO-DO:
                hideLoader();
                hideHero(); //Hiding the Hero | Login Screen
                showDashboard(); //Showing the dashboard
                clearForm('.hero-wrapper'); //Clearing the filled form
                // Below code is for teasting purpose.
                var encryptedResponse = encrypt(returnData);
                var decryptedResponse = decrypt(encryptedResponse);
                //Popuate Technology Dashoard
                populateTechDashBoard(returnData);
            } else {}
        },
        function (jqXHR, textStatus, errorThrown) {
            hideLoader();
        }
    );
}
/*END: Fetch QuestionSet*/

/*START: populate Technology Dashboard*/
function populateTechDashBoard(returnData) {
    var catagory = Object.keys(returnData.CoxAcademyQuestions.questionSet);
    var techListHTML = '<ul class="technology-list"></ul>';
    catagory.map((item) => {
        //Print grounp
        console.log(item);
        $('.test-selection-body').append('<h3 class="heading">' + item + '</h3>');
        //tech group
        var techList = Object.keys(returnData.CoxAcademyQuestions.questionSet[item]);
        console.log(techList);
        $('.test-selection-body').append(techListHTML);
        techList.map((item) => {
            $('.technology-list:last-child').append('<li class="technology-item">' + item + '</li>');
        });
    });

}
/*END: populate Technology Dashboard*/


/*START:  Manage Encryption*/
function encrypt(data) {
    var secret = 'cox-academy';
    return CryptoJS.AES.encrypt(JSON.stringify(data), secret, {
        keySize: 128 / 8,
        iv: secret,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}
/*END: Manage Encryption*/

/*START:  Manage Decryption*/
function decrypt(data) {
    var secret = 'cox-academy';
    return JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(data, secret, {
        keySize: 128 / 8,
        iv: secret,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })));
}
/*END: Manage Decryption*/

/*START: Logout*/
function logOut() {
    $(document).on('click', 'header .log-out-btn', function () {
        showLoader(); //Showing Loader

        //NOTE: Ajax call comes here to update DB. After getting response call this functions without setTimeout
        setTimeout(function () {
            hideLoader(); //Hiding Loader
            hideDashboard(); //Hiding Dashboard
            showHero(); //Showing Hero/ Login Page;
        }, 100);

    });
}
/*END: Logout*/

/*START: Clear Form*/
function clearForm(ele) {
    $(ele).find('.form-group').each(function () {
        $(this).removeClass('has-value').removeClass('error').find('.form-input').val('');
        formEmpty = true; //Assign the formEmpty flag to true again to restart the validation process.
    })
}
/*END: Clear Form*/

/*START: Selct Technology*/
/*NOTE: Only to select technology and on select of one technology footer will appear*/
function selectTech() {
    var ele;
    $(document).on('click', '.test-selection-body .technology-item', function () {
        ele = $(this);
        $('.test-selection-body .technology-item').removeClass('selected');
        ele.addClass('selected');
        $('.test-selection-footer').addClass('show');
        startTest(); //Calling start test
    });
}
/*END: Selct Technology*/

/*STRAT: Start Test*/
function startTest() {
    var ele, selectTech;
    $(document).on('click', '.test-selection-footer .start-test-btn', function () {
        ele = $(this);
        selectTech = ele.closest('.test-selection-wrapper').find('.technology-item.selected span').text();
        $('.test-selection-wrapper').removeClass('show');
        $('.test-screen').addClass('show');
        // Resetting previous selection
        $('.option-item').each(function () {
            $(this).removeClass('selected');
        })
        chooseAnswer(); //Calling Choose Answer
        /*NOTE: Fetch technology releated question answer here with selctTech variable*/
    });
}
/*END: Start Test*/

/*START: Choose Answer form Options*/
function chooseAnswer() {
    var ele;
    $(document).on('click', '.option-item', function () {
        ele = $(this);

        //Select All
        if (ele.attr('attr') == "sa") {
            ele.closest('.option-list').find('.option-item').each(function () {
                $(this).addClass('selected');
            })
        } else if (ele.attr('attr') == "al") { //Above All
            ele.closest('.option-list').find('.option-item:not(:last-child)').each(function () {
                $(this).addClass('selected');
            });
        } else if (ele.attr('attr') == "na") { //None of All
            ele.closest('.option-list').find('.option-item').each(function () {
                $(this).removeClass('selected');
            });
            ele.toggleClass('selected');

        } else { //Custom
            ele.toggleClass('selected');
            if ($('.option-list').find('.option-item:last-child').attr('attr') === 'na') {
                $('.option-list').find('.option-item:last-child').removeClass('selected');
            }
        }

    });
}
/*END: Choose Answer form Options*/
