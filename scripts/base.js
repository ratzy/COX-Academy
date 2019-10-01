 var formEmpty = true;
 $(document).ready(() => {
     inputFunction();
     showUserActivity();
     logIn();
     logOut();
 });

 /*START: Input*/
 function inputFunction() {
     var ele, inputVal;
     /*Note: To remove error message from input*/
     $(document).on('click', '.form-input', function () {
         ele = $(this);
         ele.closest('.form-group').removeClass('error');
     });

     /*Note: To check the input value null or not | UI logic*/
     $(document).on('focusout', '.form-input', function () {
         ele = $(this);
         inputVal = ele.val();
         if (inputVal.length) {
             ele.closest('.form-group').addClass('has-value');
         } else {
             ele.closest('.form-group').removeClass('has-value');
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
 }
 /*END: Showing Dashboard*/

 /*START: Hiding Dashboard*/
 function hideDashboard() {
     $('header').removeClass('show');
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
             }
         });

         //Checking if form is not empty
         if (!formEmpty) {
             //NOTE: After validation of null call this function along with the API call for login validation
             showLoader();

             //NOTE: Ajax call comes here to validate the input in DB. After getting response call this function without setTimeout
             setTimeout(function () {
                 hideLoader();
                 hideHero(); //Hiding the Hero | Login Screen
                 showDashboard(); //Showing the dashboard
                 clearForm('.hero-wrapper'); //Clearing the filled form
             }, 100);
         }


     });
 }
 /*END: Login*/

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
         $(this).removeClass('has-value').find('.form-input').val('');
         formEmpty = true; //Assign the formEmpty flag to true again to restart the validation process.
     })
 }
 /*END: Clear Form*/
