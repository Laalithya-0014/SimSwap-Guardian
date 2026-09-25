const eventsBox = document.getElementById("events");
const demoBtn = document.getElementById("demoBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultSection = document.getElementById("resultSection");
const riskLevel = document.getElementById("riskLevel");


// -----------------------------
// Demo button
// -----------------------------
demoBtn.addEventListener("click", function () {
    eventsBox.value =
`Password reset requested
SIM replacement requested
Multiple OTP requests
Unknown device login
Phone number changed`;
});


// -----------------------------
// Analyze button
// -----------------------------
analyzeBtn.addEventListener("click", async function () {

    const rawEvents = eventsBox.value.trim();

    // No events entered
    if (rawEvents === "") {
        riskLevel.innerHTML = `
            <div class="analysis-box">
                <h3>⚠️ No Events Entered</h3>
                <p>Please enter some security events to analyze.</p>
            </div>
        `;

        resultSection.scrollIntoView({
            behavior: "smooth"
        });

        return;
    }


    // Convert textarea lines into an array
    const events = rawEvents
        .split("\n")
        .map(event => event.trim())
        .filter(event => event.length > 0);


    // Show loading state
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing...";

    riskLevel.innerHTML = `
        <div class="analysis-box">
            <h3>🔍 Analyzing Security Events...</h3>
            <p>Please wait while the system evaluates the activity.</p>
        </div>
    `;


    try {

        // Send events to Flask backend
        const response = await fetch("/analyze", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                events: events
            })
        });


        const data = await response.json();


        // Backend returned an error
        if (!response.ok) {
            throw new Error(
                data.error || "Server returned an error."
            );
        }


        // -----------------------------
        // Extract backend response
        // -----------------------------
        const score = data.risk_score;
        const level = data.risk_level;
        const signals = data.signals || [];
        const analysis = data.analysis || "No analysis available.";


        // -----------------------------
        // Build signals HTML
        // -----------------------------
        let signalsHTML = "";

        if (signals.length > 0) {

            signalsHTML = signals
                .map(signal => `<p>✓ ${signal}</p>`)
                .join("");

        } else {

            signalsHTML = `
                <p>No specific risk signals detected.</p>
            `;
        }


        // -----------------------------
        // Determine risk message
        // -----------------------------
        let riskMessage = "";

        if (level === "CRITICAL") {

            riskMessage =
                "Critical-risk activity detected.";

        } else if (level === "HIGH") {

            riskMessage =
                "High-risk activity detected.";

        } else if (level === "MEDIUM") {

            riskMessage =
                "Moderate-risk activity detected.";

        } else {

            riskMessage =
                "Low-risk activity detected.";
        }


        // -----------------------------
        // Display complete result
        // -----------------------------
        riskLevel.innerHTML = `

            <div class="risk-header">

                <div>
                    <h3>🔴 ${level} RISK</h3>
                    <p>${riskMessage}</p>
                </div>

                <div class="risk-score">
                    ${score}<span>/100</span>
                </div>

            </div>


            <div class="analysis-box">

                <h3>🚨 Detected Signals</h3>

                ${signalsHTML}

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

                <p>${analysis}</p>

            </div>


            <div class="analysis-box">

                <h3>🛡️ Recommended Actions</h3>

                <p>1. Contact your mobile service provider.</p>
                <p>2. Secure your email and account passwords.</p>
                <p>3. Do not share OTPs with anyone.</p>
                <p>4. Review recent account login activity.</p>

            </div>

        `;


        // Scroll to result
        resultSection.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error("Analysis error:", error);

        riskLevel.innerHTML = `

            <div class="analysis-box">

                <h3>❌ Analysis Failed</h3>

                <p>
                    ${error.message}
                </p>

                <p>
                    Please make sure the Flask server is running.
                </p>

            </div>

        `;

    } finally {

        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "🔍 Analyze";

    }

});