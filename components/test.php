<div class="test-screen">
    <div class="test-screen-block">
        <div class="test-screen-body">
            <div class="question-progess-indicator">
                <span class="current-question">1</span>
                <span class="total-question"></span>
            </div>
            <div class="question-wrapper">
                <em class="question-number">01</em>
                <h3 class="question"></h3>
            </div>
            <div class="option-wrapper">
                <em>Choose Answer</em>
                <ul class="option-list">
                </ul>
            </div>
            <div class="action-wrapper">
                <button class="btn secondary-btn prev-btn disabled"><i class="fa fa-angle-left"></i><em>Previous</em></button>
                <button class="btn secondary-btn next-btn disabled"><i class="fa fa-angle-right"></i><em>Next</em></button>
                <button class="btn primary-btn submit-btn disabled">
                    <em>Submit</em><i class="fa fa-angle-right"></i></button>

            </div>
        </div>
        <div class="test-screen-footer">
            <ul class="progress-list">
                <li class="progress-item"><span class="range"></span>Beginner <em></em></li>
                <li class="progress-item"><span class="range"></span>Advance <em></em></li>
                <li class="progress-item"><span class="range"></span>Expert <em></em></li>
            </ul>
            <div class="flex-wrapper flex-center">
                <em>Earned badges</em>
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
    </div>
</div>

<div class="answer-desc-wrapper">
    <button class="btn btn-text" onclick="hideAnsDesc();">Close</button>
    <div class="answer-block">
        <h3>Correct Answer</h3>
        <div class="answer">
            <pre><xmp>True</xmp></pre>
        </div>
    </div>
    <div class="answer-desc-block">
        <h3>Answer Explanation</h3>
        <p>Yes! HTML5 is designed, as much as possible, to be backward compatible with existing web browsers.</p>
    </div>
</div>
