var formEmpty = true;
var qLimit = 5; //Question per level
var questionCount = 1; //Counter to control the question flow
var totalQuestion = 10; //Demo 
var beginnerQuestion = 6; //Demo 
var advanceQuestion = 5; //Demo 
var expertQuestion = 4; //Demo 
var basicQuestionArr = [];

$(document).ready(() => {
    inputFunction();
    showUserActivity();
    logIn();
    logOut();
    selectTech();
    //    nextQuestion();
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
function generateRandArr() {
    let randArr = [];
    for (let i = 0; i <= qLimit; i++) {
        let temp = Math.floor(Math.random() * 10);
        if (randArr.indexOf(temp) === -1) {
            randArr.push(temp);
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
            } else {}
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
    //    var techListHTML = '<ul class="technology-list"></ul>';
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

/*START: Populate Question Answer*/
function popuateQuestionAnswer(selectTech) {
    /* NOTE: Fetching selected category */
    let selectedCat = $('.technology-item.selected').closest('.technology-list').attr('catAttr');

    //Generating random question
    let randomArr = generateRandArr();
    //If it's one digit add 0 as prefix
    if (randomArr[0] <= 9) {
        questionCount = 0 + questionCount;
    } else {
        questionCount;
    }

    let returnData = decrypt(sessionStorage.getItem('encryptedResponse'));
    let basicRandomArr = generateRandArr();
    basicQuestionArr = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].filter((item) => {
        return item.questionType === 'basic';
    });
    basicQuestionArr = basicQuestionArr.filter((item, index) => {
        return basicRandomArr.indexOf(index) !== -1
    });
    let advanceQuestionArr = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].filter((item) => {
        return item.questionType === 'advance';
    });
    advanceQuestionArr = advanceQuestionArr.filter((item, index) => {
        return basicRandomArr.indexOf(index) !== -1
    });
    let expertQuestionArr = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].filter((item) => {
        return item.questionType === 'expert';
    });
    expertQuestionArr = expertQuestionArr.filter((item, index) => {
        return basicRandomArr.indexOf(index) !== -1
    });



    generateQuestionAnswer();


    /* NOTE: Fetching specific QA as per question level */
    //    generateQuestionAsLevel(selectedCat, selectTech, 'basic');
}
/*END: Populate Question Answer*/


function generateQuestionAnswer() {
    $('.question-wrapper .question-number').html(questionCount);
    //Popuating Question
    $('.question-wrapper .question').html(basicQuestionArr[questionCount - 1].question);
    $('.option-list').html('');
    //Populating Options
    for (var i = 0; i < basicQuestionArr[questionCount].options.length; i++) {
        $('.option-list').append('<li class="option-item"><pre><xmp>' + basicQuestionArr[questionCount - 1].options[i] + '</xmp></pre></li>');
    }

    //Getting correct answer and answer details
    correctAnswer = basicQuestionArr[questionCount - 1].answers;
    answerDetails = basicQuestionArr[questionCount - 1].answerDetails;
    $('.answer-desc-wrapper .answer-block xmp').html('');

    for (var i = 0; i <= correctAnswer.length; i++) {
        $('.answer-desc-wrapper .answer-block xmp').append(correctAnswer[i]);
    }

    $('.answer-desc-wrapper .answer-desc-block p').html(answerDetails);
    $('.current-question').html(questionCount);

    submitQuestion(correctAnswer);
}


/*START: Generate Questions and options as question level*/
function generateQuestionAsLevel(selectedCat, selectTech, levelTyp) {
    let correctAnswer, answerDetails;
    let returnData = decrypt(sessionStorage.getItem('encryptedResponse'));

    let basicQuestionArr = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].filter((item) => {
        return item.questionType === 'basic';
    });
    let advanceQuestionArr = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].filter((item) => {
        return item.questionType === 'advance';
    });
    let expertQuestionArr = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].filter((item) => {
        return item.questionType === 'expert';
    });

    returnData = returnData.CoxAcademyQuestions.questionSet[selectedCat][selectTech].filter((item) => {
        return item.questionType === levelTyp;
    });

    //Generating random question
    let randomArr = generateRandArr();
    //If it's one digit add 0 as prefix
    if (randomArr[0] <= 9) {
        questionCount = 0 + questionCount;
    } else {
        questionCount;
    }
    $('.question-wrapper .question-number').html(questionCount);
    //Popuating Question
    $('.question-wrapper .question').html(returnData[randomArr[0]].question);
    $('.option-list').html('');
    //Populating Options
    for (var i = 0; i < returnData[randomArr[0]].options.length; i++) {
        $('.option-list').append('<li class="option-item"><pre><xmp>' + returnData[randomArr[0]].options[i] + '</xmp></pre></li>');
    }

    //Getting correct answer and answer details
    if (questionCount <= qLimit) {
        correctAnswer = returnData[randomArr[0]].answers;
        answerDetails = returnData[randomArr[0]].answerDetails;
        $('.answer-desc-wrapper .answer-block xmp').html('');

        for (var i = 0; i <= correctAnswer.length; i++) {
            $('.answer-desc-wrapper .answer-block xmp').append(correctAnswer[i]);
        }

        $('.answer-desc-wrapper .answer-desc-block p').html(answerDetails);
    }
    submitQuestion(correctAnswer);

}
/*END: Generate Questions and options as question level*/

/*START: SUbmit Answer*/
function submitQuestion(correctAnswer) {
    var ele, selectedAnswer;
    var selectedAnswers = [];
    $(document).on('click', '.test-screen-body .submit-btn', function () {
        ele = $(this);
        ele.addClass('clicked');
        ele.closest('.test-screen-body').find('.option-item.selected').each(function () {
            selectedAnswer = $(this).find('xmp').text();
            selectedAnswers.push(selectedAnswer);
        });

        //Checking the answer if correct or wrong
        if (correctAnswer == 'Above All' && selectedAnswers.indexOf('Above All') != -1) {
            $('.test-screen-body').find('.option-item.selected').each(function () {
                $(this).addClass('correct');
            });
        } else {
            for (var i = 0; i <= selectedAnswer.length; i++) {
                if (correctAnswer.indexOf(selectedAnswer[i]) != -1) {
                    $('.test-screen-body').find('.option-item.selected').each(function () {
                        $(this).addClass('correct');
                    });
                } else {
                    $('.test-screen-body').find('.option-item.selected').each(function () {
                        $(this).addClass('wrong');
                    });

                    $('.test-screen-body').find('.option-item').each(function () {
                        var option = $(this).find('xmp').text();
                        if (correctAnswer.indexOf(option) != -1) {
                            $(this).addClass('correct');
                        }
                    });
                }
            }
        }

        showAnsDesc();
        //Controlling disable/enable next/prev button according to question flow
        if (questionCount == 0) {
            ele.closest('.action-wrapper').find('.next-btn').removeClass('disabled');
        } else if (questionCount >= 1) {
            ele.closest('.action-wrapper').find('.btn').removeClass('disabled');
        } else if (questionCount == totalQuestion) {
            ele.closest('.action-wrapper').find('.btn.nxt-btn').addClass('disabled');
        } else {
            ele.closest('.action-wrapper').find('.btn.prev-btn').addClass('disabled');
        }

    });
}
/*END: SUbmit Answer*/

/*SATRT: Next Question*/
function nextQuestion() {
    $(document).on('click', '.test-screen-body .next-btn:not(.disabled)', function () {
        $(this).addClass('disabled');
        $('.submit-btn').removeClass('clicked');
        if (questionCount <= beginnerQuestion) {
            $('.progress-item:first-child .range').css('width', 'calc(100%/' + beginnerQuestion);
        } else if (questionCount > beginnerQuestion && questionCount <= advanceQuestion) {
            $('.progress-item:nth-child(2) .range').css('width', 'calc(100%/' + beginnerQuestion);
        } else {
            $('.progress-item:last-child .range').css('width', 'calc(100%/' + beginnerQuestion);
        }
        if (questionCount <= qLimit) {
            questionCount++;
            generateQuestionAnswer();
            return false;
        }

    });
    return false;
}
/*END: Next Question*/

/*START: Show Answer Description*/
function showAnsDesc() {
    $('.bg-overlay, .answer-desc-wrapper').addClass('show');
}
/*END: Show Answer Description*/

/*START: Hide Answer Description*/
function hideAnsDesc() {
    $('.bg-overlay, .answer-desc-wrapper').removeClass('show');
    nextQuestion();

}
/*END: Hide Answer Description*/

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
        });

        popuateQuestionAnswer(selectTech); //Populating Question with Answers for the selected technology

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
        ele.closest('.test-screen-body').find('.submit-btn').removeClass('disabled');
        //Once submit button is clicked option cann't be changed
        if ($('.submit-btn').hasClass('clicked')) {
            return false;
        }
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
            //            ele.closest('.option-list').find('.option-item').removeClass('selected');
            ele.toggleClass('selected');

            if ($('.option-list').find('.option-item:last-child').attr('attr') === 'na') {
                $('.option-list').find('.option-item:last-child').removeClass('selected');
            }


            if (!$('.option-list').find('.option-item.selected').length) {
                $('.submit-btn').addClass('disabled');
            }
        }

    });
}
/*END: Choose Answer form Options*/
