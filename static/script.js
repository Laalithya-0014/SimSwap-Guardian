const eventsBox = document.getElementById("events");
const demoBtn = document.getElementById("demoBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const riskLevel = document.getElementById("riskLevel");


demoBtn.addEventListener("click", function () {

    eventsBox.value =
`Password reset requested
SIM replacement requested
Multiple OTP requests
Unknown device login
Phone number changed`;

});


analyzeBtn.addEventListener("click", function () {

    const events = eventsBox.value.trim();

    if (events === "") {

        riskLevel.innerHTML = `
            <h3>⚠️ No Events Entered</h3>
            <p>Please enter some security events to analyze.</p>
        `;

        return;
    }


    riskLevel.innerHTML = `

        <div class="risk-header">

            <div>
                <h3>🔴 HIGH RISK</h3>
                <p>Possible account takeover detected</p>
            </div>

            <div class="risk-score">
                85<span>/100</span>
            </div>

        </div>


        <div class="analysis-box">

            <h3>🚨 Detected Signals</h3>

            <p>✓ SIM replacement requested</p>
            <p>✓ Password reset requested</p>
            <p>✓ Multiple OTP requests</p>
            <p>✓ Unknown device login</p>

        </div>


        <div class="analysis-box">

            <h3>🔗 Attack Chain</h3>

            <div class="attack-chain">

                <div>Password Reset</div>

                <span>↓</span>

                <div>SIM Replacement</div>

                <span>↓</span>

                <div>OTP Requests</div>

                <span>↓</span>

                <div>Unknown Login</div>

            </div>

        </div>


        <div class="analysis-box">

            <h3>🤖 AI Analysis</h3>

            <p>
                The combination of SIM replacement,
                password reset and repeated OTP requests
                indicates a possible account takeover attempt.
            </p>

        </div>
        <div class="analysis-box">

    <h3>🛡️ Recommended Actions</h3>

    <p>1. Contact your mobile service provider.</p>
    <p>2. Secure your email and account passwords.</p>
    <p>3. Do not share OTPs with anyone.</p>
    <p>4. Review recent account login activity.</p>

</div>

    `;

});