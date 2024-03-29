<div class="full-vp hero-wrapper">
    <img src="assets/images/hero-image.svg" alt="Hero Image" class="hero-img" />
    <div class="hero-content-wrapper">
        <img src="assets/images/site-logo.png" alt="Cox-Academy" class="site-logo" />
        <div class="hero-form-wrapper">
            <!--NOTE: Small description comes here-->
            <p class="para">Test your unique skill set and earn badges. Test your set and earn badges.</p>
            <!--START: Login Form-->
            <form>
                <div class="form-group">
                    <div class="input-wrapper">
                        <input type="mail" class="form-input">
                        <span class="place-holder">Email Address</span>
                    </div>
                    <span class="error-msg">Please enter your valid mail id</span>
                </div>
                <div class="form-group">
                    <div class="input-wrapper">
                        <input type="password" class="form-input">
                        <span class="place-holder">Password</span>
                    </div>
                    <span class="error-msg">Please enter your correct password</span>
                </div>
            </form>
            <!--END: Login Form-->
            <button type="button" class="btn primary-btn login-btn">Submit <i class="fa fa-angle-right"></i></button>
        </div>
        <button type="button" class="btn text-btn know-more" onclick="showModal('.know-more-modal')">Know More</button>
    </div>
</div>

<!--START: Know More Modal-->
<div class="modal know-more-modal">
    <div class="modal-header">
        <div class="header-action-wrapper">
            <h3 class="heading">COX-Academy</h3>
            <i class="fa fa-times" onclick="hideModal();"></i>
        </div>
    </div>
    <div class="modal-body">
        <p class="para">Fusce fringilla ipsum eu elementum auctor. Proin condimentum sodales tempus. Donec volutpat, libero pretium mollis molestie, sapien ante dapibus augue, vitae eleifend tortor sapien vitae risus. Donec faucibus egestas mauris, fermentum tincidunt sem posuere vel. Curabitur sed semper quam, eget bibendum magna. Sed ultricies placerat nunc, vehicula imperdiet leo. Phasellus eget ipsum et nibh condimentum feugiat. Pellentesque at molestie augue.</p>
    </div>
    <div class="modal-footer">
        <ul class="badge-list">
            <li class="badge-item">
                <img src="assets/images/beginner-badge.png" alt="Beginner Badge" />
                <span>Beginner</span>
            </li>
            <li class="badge-item">
                <img src="assets/images/advance-badge.png" alt="Advance Badge" />
                <span>Advance</span>
            </li>
            <li class="badge-item">
                <img src="assets/images/expert-badge.png" alt="Expert Badge" />
                <span>Expert</span>
            </li>
        </ul>

    </div>

</div>
<!--END: Know More Modal-->
