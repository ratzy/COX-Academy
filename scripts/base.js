var formEmpty = true;
var questionCount = 1; //Counter to control the question flow
var beginnerQuestion = 0;
var advanceQuestion = 0;
var expertQuestion = 0;
var basicQuestionArr = [];
var advanceQuestionArr = [];
var expertQuestionArr = [];
var selectedAnswers = [];
var correctAnswer = [];
var answerDetails = [];

$(document).ready(() => {
    inputFunction();
    showUserActivity();
    logIn();
    logOut();
    selectTech();
    chooseAnswer(); //Calling Choose Answer
    submitQuestion();
    nextQuestion();
    prevQuestion();
    gobacktoDashboard();
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

/*START: Show Hero*/
function showHero() {
    $('.hero-wrapper').removeClass('hide');
}
/*END: Show Hero*/

/*START: Hide Hero*/
function hideHero() {
    $('.hero-wrapper').addClass('hide');
}
/*END: Hide Hero*/

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

/*STRAT: Generate Random Array*/
function generateRandArr(limit, actualArrLength) {
    let randArr = [];
    for (let i = 1; i <= limit; i++) {
        let temp = Math.floor(Math.random() * actualArrLength);
        if (randArr.indexOf(temp) === -1) {
            randArr.push(temp);
        } else {
            if (i === 1) {
                i = 1;
            } else {
                i -= 1;
            }
        }
    }
    return randArr;
}
/*END: Generate Random Array*/

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
                hideHero(); //Hiding the Hero | Login Screen
                setTimeout(function () {
                    hideLoader();
                    showDashboard(); //Showing the dashboard
                }, 300);
                clearForm('.hero-wrapper'); //Clearing the filled form
                // Below code is for teasting purpose.
                var encryptedResponse = encrypt(returnData);
                sessionStorage.setItem('encryptedResponse', encryptedResponse);
                //                var decryptedResponse = decrypt(encryptedResponse);
                //Popuate Technology Dashoard
                populateTechDashBoard();
            } else { }
        },
        function (jqXHR, textStatus, errorThrown) {
            hideLoader();
        }
    );
}
/*END: Fetch QuestionSet*/

/*START: populate Technology Dashboard*/
function populateTechDashBoard() {
    let returnData = decrypt(sessionStorage.getItem('encryptedResponse'));
    var iconPath = "assets/images/";
    var catagory = Object.keys(returnData.CoxAcademyQuestions.questionSet);
    $('.test-selection-body').html('');
    catagory.map((catItem) => {
        //Appending the Category Heading and Tech Item List
        $('.test-selection-body').append('<h3 class="heading">' + catItem + '</h3>');
        //Tech List
        var techList = Object.keys(returnData.CoxAcademyQuestions.questionSet[catItem]);
        $('.test-selection-body').append('<ul class="technology-list" catAttr="' + catItem + '"></ul>');
        techList.map((techListItem) => {
            $('.technology-list:last-child').append('<li class="technology-item"><img src=' + iconPath + techListItem.toLowerCase().replace('.', '') + '.png alt="' + techListItem + '"><span>' + techListItem + '</span></li>');
        });
    });

}
/*END: populate Technology Dashboard*/

/*START: Fetching Question Answer*/
function generateQuestionAnswer(selectTech) {
    /* NOTE: Fetching selected category */
    let selectedCat = $('.technology-item.selected').closest('.technology-list').attr('catAttr');

    let returnData = decrypt(sessionStorage.getItem('encryptedResponse'));
    beginnerQuestion = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].beginnerQuestion;
    advanceQuestion = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].advanceQuestion;
    expertQuestion = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].expertQuestion;
    basicQuestionArr = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].questionList.filter((item) => {
        return item.questionType === 'basic';
    });
    let beginnerRandArr = generateRandArr(beginnerQuestion, basicQuestionArr.length);
    basicQuestionArr = basicQuestionArr.filter((item, index) => {
        return beginnerRandArr.indexOf(index) !== -1
    });
    advanceQuestionArr = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].questionList.filter((item) => {
        return item.questionType === 'advance';
    });
    let advanceRandArr = generateRandArr(advanceQuestion, advanceQuestionArr.length);
    advanceQuestionArr = advanceQuestionArr.filter((item, index) => {
        return advanceRandArr.indexOf(index) !== -1
    });
    expertQuestionArr = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].questionList.filter((item) => {
        return item.questionType === 'expert';
    });
    let expertRandArr = generateRandArr(expertQuestion, expertQuestionArr.length);
    expertQuestionArr = expertQuestionArr.filter((item, index) => {
        return expertRandArr.indexOf(index) !== -1
    });
    //Populatating question number into progress bar
    $('.progress-item:first-child em').html('(' + basicQuestionArr.length + ')');
    $('.progress-item:nth-child(2) em').html('(' + advanceQuestionArr.length + ')');
    $('.progress-item:last-child em').html('(' + expertQuestionArr.length + ')');

    populateQuestionAnswerDOM(); //Populating QA DOM
    disableProfileActivity(); //Disable Profile Activity

    //Populating Total Question Number
    $('.total-question').html('/ ' + parseInt(beginnerQuestion + advanceQuestion + expertQuestion));
    //Reseting Question Dashboard at First Time
    resettingQuestionDashboard();
}
/*END: Fetching Question Answer*/



/*START: Populating Question Answer into DOM*/
function populateQuestionAnswerDOM() {
    if ((beginnerQuestion + advanceQuestion + expertQuestion) < questionCount) {
        return false;
    }
    $('.question-wrapper .question-number').html(questionCount);
    // This below scetion will check on which level user is giving test.
    let currentLevelQAArr = [];
    currentLevelQAArr = basicQuestionArr.concat(advanceQuestionArr, expertQuestionArr);
    //Popuating Question
    $('.question-wrapper .question').html(currentLevelQAArr[questionCount - 1].question);
    $('.option-list').html('');
    //Populating Options
    for (var i = 0; i < currentLevelQAArr[questionCount - 1].options.length; i++) {
        let answerTyp = currentLevelQAArr[questionCount - 1].answerTyp;
        if (answerTyp == 'single-selection') {
            $('.option-list').append('<li class="option-item" attr="' + answerTyp + '"><pre><xmp>' + currentLevelQAArr[questionCount - 1].options[i] + '</xmp></pre></li>');
        } else {
            let optionVal = currentLevelQAArr[questionCount - 1].options[i];
            if (optionVal.toLowerCase() === 'above all') {
                answerTyp = 'above-all';
            } else if (optionVal.toLowerCase() === 'none of the above') {
                answerTyp = 'none';
            } else if (optionVal.toLowerCase() === 'select all') {
                answerTyp = 'select-all';
            } else {
                answerTyp = 'multi-selection';
            }
            $('.option-list').append('<li class="option-item" attr="' + answerTyp + '"><pre><xmp>' + currentLevelQAArr[questionCount - 1].options[i] + '</xmp></pre></li>');
        }
    }

    //Getting correct answer and answer details
    correctAnswer = currentLevelQAArr[questionCount - 1].answers;
    answerDetails = currentLevelQAArr[questionCount - 1].answerDetails;
    $('.answer-desc-wrapper .answer-block xmp').html('');
    $('.answer-desc-wrapper .answer-desc-block p').html('');
    $('.current-question').html('');

    for (var i = 0; i <= correctAnswer.length; i++) {
        $('.answer-desc-wrapper .answer-block xmp').append(correctAnswer[i]);
    }

    $('.answer-desc-wrapper .answer-desc-block p').html(answerDetails);
    $('.current-question').html(questionCount);
    checkActionBtn();

}
/*END: Populating Question Answer into DOM*/

/*START: Activating action button on question count condition*/
function checkActionBtn(actionType) {
    let isAnswerSelected = false;
    let isCorrectAnswerSelected = false;
    let isWrongAnswerSelected = false;
    $('.option-list .option-item').each(function (i) {
        if ($(this).hasClass('selected')) {
            isAnswerSelected = true;
        }
        if ($(this).hasClass('correct')) {
            isCorrectAnswerSelected = true;
        }
        if ($(this).hasClass('wrong')) {
            isWrongAnswerSelected = true;
        }
    });
    //Handeling the show and hide of the show answer button
    if (isAnswerSelected == true) {
        showAnswerBtn(); //Showing Show Answer Button
    } else {
        hideAnswerBtn(); //Hiding Show Answer Button
    }

    $('.test-screen-body .action-wrapper').find('.btn').addClass('disabled');
    if (questionCount == 1) {
        if (isAnswerSelected && (isCorrectAnswerSelected || isWrongAnswerSelected)) {
            $('.test-screen-body .action-wrapper').find('.next-btn').removeClass('disabled');
            $('.test-screen-body .action-wrapper').find('.btn.submit-btn').addClass('clicked');
        } else if (isAnswerSelected && !isCorrectAnswerSelected && !isWrongAnswerSelected) {
            $('.test-screen-body .action-wrapper').find('.btn.submit-btn').removeClass('disabled clicked');
        }
    } else if (questionCount > 1 && questionCount < (beginnerQuestion + advanceQuestion + expertQuestion)) {
        if (isAnswerSelected && (isCorrectAnswerSelected || isWrongAnswerSelected)) {
            $('.test-screen-body .action-wrapper').find('.btn:not(.submit-btn)').removeClass('disabled');
            $('.test-screen-body .action-wrapper').find('.btn.submit-btn').addClass('clicked');
        } else if (isAnswerSelected && !isCorrectAnswerSelected && !isWrongAnswerSelected) {
            $('.test-screen-body .action-wrapper').find('.btn:not(.nxt-btn)').removeClass('disabled clicked');
        } else {
            $('.test-screen-body .action-wrapper').find('.btn.prev-btn').removeClass('disabled');
            $('.test-screen-body .action-wrapper').find('.btn.submit-btn').removeClass('clicked');
        }
    } else if (questionCount == (beginnerQuestion + advanceQuestion + expertQuestion)) {
        if (isAnswerSelected && (isCorrectAnswerSelected || isWrongAnswerSelected)) {
            $('.test-screen-body .action-wrapper').find('.prev-btn').removeClass('disabled');
            $('.test-screen-body .action-wrapper').find('.btn.submit-btn').addClass('clicked');
            if (actionType && actionType !== 'on-submit') {
                checkTestCompletion(); //Checking last question to show the completion modal
            }
        } else if (isAnswerSelected && !isCorrectAnswerSelected && !isWrongAnswerSelected) {
            $('.test-screen-body .action-wrapper').find('.btn:not(.nxt-btn)').removeClass('disabled clicked');
        } else {
            $('.test-screen-body .action-wrapper').find('.btn.prev-btn').removeClass('disabled');
            $('.test-screen-body .action-wrapper').find('.btn.submit-btn').removeClass('clicked');
        }
    } else {
        $('.test-screen-body .action-wrapper').find('.btn.prev-btn').addClass('disabled');
    }
}
/*END: Activating action button on question count condition*/

/*START: Submit Answer*/
function submitQuestion() {
    var ele, selectedAnswer;
    $(document).on('click', '.test-screen-body .submit-btn:not(.disabled)', function () {
        var tempArr = [];
        ele = $(this);
        ele.addClass('clicked disabled');
        if (questionCount > selectedAnswers.length) {
            ele.closest('.test-screen-body').find('.option-item.selected').each(function () {
                selectedAnswer = $(this).find('xmp').text();
                tempArr.push(selectedAnswer);
            });
            selectedAnswers.push(tempArr);
        }
        //Checking the answer if correct or wrong
        checkAnswer('on-submit');
        showAnsDesc();
        controllProgressList();
        checkBadgeLevel();
    });
}
/*END: Submit Answer*/

/*START: Checking Given Answer*/
function checkAnswer(actionType) {
    if (correctAnswer[0] == 'Above All' && selectedAnswers[questionCount - 1].indexOf('Above All') != -1) {
        $('.option-item[attr="above-all"]').prevAll().addClass('selected correct');
        $('.option-item[attr="above-all"]').addClass('selected correct');
    } else if (correctAnswer[0] == 'Select All' && selectedAnswers[questionCount - 1].indexOf('Select All') != -1) {
        $('.option-item[attr="select-all"]').prevAll().addClass('selected correct');
        $('.option-item[attr="select-all"]').addClass('selected correct');
    } else {
        $('.option-list .option-item').each(function (i) {
            var selecedItem = $(this).find('xmp').html();
            $.each(selectedAnswers[questionCount - 1], (index, item) => {
                if (selecedItem === item && !$(this).hasClass('selected')) {
                    $(this).addClass('selected');
                }
            });
            if (correctAnswer.indexOf(selecedItem) !== -1) {
                $(this).removeClass('wrong').addClass('correct');
            } else if ($(this).hasClass('selected')) {
                $(this).removeClass('correct').addClass('wrong');
            }
        });
    }
    checkActionBtn(actionType);
}
/*END: Checking Given Answer*/

/*SATRT: Next Question*/
function nextQuestion() {
    $(document).on('click', '.test-screen-body .next-btn:not(.disabled)', function () {
        questionCount++;
        if (questionCount <= (beginnerQuestion + advanceQuestion + expertQuestion)) {
            populateQuestionAnswerDOM();
            if (questionCount <= selectedAnswers.length) {
                checkAnswer();
            }
        } else {
            questionCount--;
        }

    });
}
/*END: Next Question*/

/*START: Check and show completion modal as per the current qustion number*/
function checkTestCompletion() {
    showModal('.test-completion-modal'); //Showing Completion Modal
}
/*END: Check and show completion modal as per the current qustion number*/

/*START: Previous Question*/
function prevQuestion() {
    $(document).on('click', '.test-screen-body .prev-btn:not(.disabled)', function () {
        $(this).addClass('disabled');
        if (questionCount <= (beginnerQuestion + advanceQuestion + expertQuestion)) {
            questionCount--;
            populateQuestionAnswerDOM();
            $('.option-item').each(function () {
                var text = $(this).find('xmp').text();
                for (var i = 0; i < selectedAnswers[questionCount - 1].length; i++) {
                    if (text == selectedAnswers[questionCount - 1]) {
                        $(this).addClass('selected');
                    }
                }
            });
        }
        checkAnswer();
    });
}

/*END: Previous Question*/

/*START: Controll Progress List*/
function controllProgressList() {
    if (questionCount <= beginnerQuestion) {
        $('.progress-item:first-child .range').css('width', 'calc((100%/' + beginnerQuestion + ')*' + questionCount + ')');
    } else if (questionCount > beginnerQuestion && questionCount <= (beginnerQuestion + advanceQuestion)) {
        $('.progress-item:nth-child(2) .range').css('width', 'calc((100%/' + advanceQuestion + ')*' + (questionCount - advanceQuestion) + ')');
    } else {
        $('.progress-item:last-child .range').css('width', 'calc((100%/' + expertQuestion + ')*' + (questionCount - advanceQuestion - expertQuestion) + ')');
    }
}
/*END: Controll Progress List*/

/*START: Checking Badge Level*/
function checkBadgeLevel() {
    if (questionCount == beginnerQuestion) {
        $('.test-screen-footer .badge-item:first-child').addClass('active');
    } else if (questionCount == (beginnerQuestion + advanceQuestion)) {
        $('.test-screen-footer .badge-item:nth-child(2)').addClass('active');
    } else if (questionCount == (beginnerQuestion + advanceQuestion + expertQuestion)) {
        $('.test-screen-footer .badge-item:last-child').addClass('active');
        activateProfileActivity(); //Activating Profile Activity
    }
}
/*END: Checking Badge Level*/


/*START: Show Answer Description*/
function showAnsDesc() {
    $('.bg-overlay, .answer-desc-wrapper').addClass('show');
}
/*END: Show Answer Description*/

/*START: Hide Answer Description*/
function hideAnsDesc() {
    $('.bg-overlay, .answer-desc-wrapper').removeClass('show');
    showAnswerBtn(); //Showing Answer Button
    if (questionCount == (beginnerQuestion + advanceQuestion + expertQuestion)) {
        checkTestCompletion(); //Checking last question to show the completion modal
    }
}
/*END: Hide Answer Description*/

/*START: Showing Answer Button*/
function showAnswerBtn() {
    $('.test-screen-body').append('<span class="show-answer-btn" onclick="showAnsDesc();"><em>View Answer</em><i class="fa fa-eye"></i></span>');
}
/*END: Showing Answer Button*/

/*START: Hide Answer Button*/
function hideAnswerBtn() {
    $('.test-screen-body .show-answer-btn').remove();
}
/*END: Hide Answer Button*/

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
        resetVariable(); //Reseting the global variables
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
        });
        generateQuestionAnswer(selectTech); //Populating Question with Answers for the selected technology
        /*NOTE: Fetch technology releated question answer here with selctTech variable*/
    });
}
/*END: Start Test*/

/*START: Choose Answer form Options*/
function chooseAnswer() {
    var ele;
    $(document).on('click', '.option-item', function () {
        ele = $(this);
        //Once submit button is clicked option cann't be changed
        if ($('.submit-btn').hasClass('clicked')) {
            return false;
        }
        ele.closest('.test-screen-body').find('.submit-btn').removeClass('disabled');
        if (ele.attr('attr') == "select-all") { // Select All
            if (ele.hasClass('selected')) {
                ele.prevAll().removeClass('selected');
                ele.removeClass('selected');
            } else {
                ele.prevAll().addClass('selected');
                ele.addClass('selected');
            }
        } else if (ele.attr('attr') == "above-all") { //Above All
            if ($('.option-item[attr="none"]').hasClass('selected')) {
                $('.option-item[attr="none"]').removeClass('selected');
            }
            if (ele.hasClass('selected')) {
                ele.prevAll().removeClass('selected');
            } else {
                ele.prevAll().addClass('selected');
            }
            ele.toggleClass('selected');
        } else if (ele.attr('attr') == "none") { //None of the above
            ele.prevAll().removeClass('selected');
            ele.toggleClass('selected');
        } else if (ele.attr('attr') == "single-selection") {
            $('.option-list').find('.option-item.selected').removeClass('selected');
            $(this).addClass('selected');
        } else { //Custom
            ele.toggleClass('selected');
            let totalOption = $('.option-list .option-item').length;
            $('.option-list .option-item').each(function () {
                if ($(this).attr('attr') === 'select-all') {
                    let totalSelectedOption = $('.option-list .option-item.selected').length;
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    } else if ((totalOption - totalSelectedOption) === 1) {
                        $('.option-item[attr="select-all"]').addClass('selected');
                    }
                } else if ($(this).attr('attr') === 'above-all') {
                    if ($('.option-item[attr="none"]').hasClass('selected')) {
                        $('.option-item[attr="none"]').removeClass('selected');
                    }
                    let totalSelectedOption = $('.option-list .option-item.selected').length;
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    } else if (($(this).prevAll().length - totalSelectedOption) === 0) {
                        $('.option-item[attr="above-all"]').addClass('selected');
                    }
                } else if ($(this).attr('attr') === 'none' && $(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                }
            });
            if (!$('.option-list .option-item.selected').length) {
                $('.submit-btn').addClass('disabled');
            }
        }
    });
}
/*END: Choose Answer form Options*/

/*START: Disable Profile Activity*/
function disableProfileActivity() {
    $('.user-profile-activity .user-profile-item').each(function () {
        $(this).addClass('disabled');
    });
}
/*END: Disable Profile Activity*/

/*START: Activate Profile Activity*/
function activateProfileActivity() {
    $('.user-profile-activity .user-profile-item').each(function () {
        $(this).removeClass('disabled');
    });
}
/*END: Activate Profile Activity*/

/*START: Reset Variable*/
function resetVariable() {
    formEmpty = true;
    questionCount = 1;
    beginnerQuestion = 0;
    advanceQuestion = 0;
    expertQuestion = 0;
    basicQuestionArr = [];
    advanceQuestionArr = [];
    expertQuestionArr = [];
    selectedAnswers = [];
    correctAnswer = [];
    answerDetails = [];
}
/*END: Reset Variable*/

/*START: Resetting question/answer dashboard before starting new*/
function resettingQuestionDashboard() {
    $('.test-screen-body .submit-btn').removeClass('clicked');
    $('.progress-item .range').css('width', '0%');
    $('.test-screen-footer .badge-item').removeClass('active');
}
/*END: Resetting question/answer dashboard before starting new*/

/*START: Go Back to Dashboard*/
function gobacktoDashboard() {
    $(document).on('click', '.go-back-dashboard-btn', function () {
        hideModal();
        $('.bg-overlay, .answer-desc-wrapper').removeClass('show');
        $('.test-screen').removeClass('show');
        $('.test-selection-wrapper').addClass('show');
        setTimeout(function () {
            resetVariable();
            resettingQuestionDashboard();
            populateTechDashBoard();
        }, 300);
    });
}
/*END: Go Back to Dashboard*/
