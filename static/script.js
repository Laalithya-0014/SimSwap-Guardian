const eventsBox = document.getElementById("events");
const demoBtn = document.getElementById("demoBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultSection = document.getElementById("resultSection");
const riskLevel = document.getElementById("riskLevel");


// -----------------------------
// Demo button
// -----------------------------
// -----------------------------
// Demo scenarios
// -----------------------------

const demoScenarios = [

    [
        "Password reset requested after an unfamiliar login attempt",
        "SIM replacement requested through the mobile carrier",
        "Phone number changed shortly after the SIM replacement",
        "Multiple OTP requests generated within a short period",
        "Login from unknown device detected from a new location"
    ],

    [
        "Password reset requested for the account",
        "Recovery email address changed unexpectedly",
        "Phone number changed without prior user confirmation",
        "Multiple OTP requests generated during account recovery",
        "Unknown device login detected immediately after recovery"
    ],

    [
        "SIM replacement requested for the registered mobile number",
        "Multiple OTP requests received within five minutes",
        "Phone number changed during the recovery process",
        "Password reset attempt detected from a new session",
        "Unknown device login detected after successful authentication"
    ],

    [
        "Password reset requested following repeated failed login attempts",
        "Multiple OTP requests generated from an unfamiliar session",
        "SIM replacement request detected for the registered number",
        "Unknown device login detected shortly after authentication",
        "Phone number changed during the same recovery window"
    ],

    [
        "Email address changed unexpectedly during account recovery",
        "Password reset requested from an unfamiliar device",
        "SIM replacement requested shortly after the recovery attempt",
        "Multiple OTP requests detected within a short time",
        "Unknown device login detected after the phone number changed"
    ],

    [
        "SIM replacement requested while the account was already under recovery",
        "Phone number changed immediately after the SIM replacement request",
        "Multiple OTP requests generated within a few minutes",
        "Password reset requested from an unfamiliar session",
        "Login from unknown device detected after OTP verification"
    ]

];


// -----------------------------
// Track last demo scenario
// -----------------------------

let lastDemoIndex = -1;


// -----------------------------
// Demo button
// -----------------------------

demoBtn.addEventListener("click", function () {

    let randomIndex;

    // Prevent the same scenario from appearing twice consecutively
    do {
        randomIndex = Math.floor(
            Math.random() * demoScenarios.length
        );
    } while (
        demoScenarios.length > 1 &&
        randomIndex === lastDemoIndex
    );

    lastDemoIndex = randomIndex;

    // Load selected scenario into textarea
    eventsBox.value = demoScenarios[randomIndex].join("\n");

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
        // Build dynamic attack chain
        // -----------------------------
        const attackChainOrder = [
            {
                name: "Password Reset",
                matches: ["Password reset attempt"]
            },
            {
                name: "SIM Replacement",
                matches: ["SIM replacement request"]
            },
            {
                name: "Phone Number Change",
                matches: ["Phone number changed"]
            },
            {
                name: "OTP Requests",
                matches: ["Multiple or unusual OTP activity"]
            },
            {
                name: "Unknown Login",
                matches: ["Login from unknown device"]
            }
        ];

        const detectedChain = attackChainOrder.filter(step =>
            step.matches.some(match => signals.includes(match))
        );

        let attackChainHTML = "";

        if (detectedChain.length === 0) {

            attackChainHTML = `
                <p>No attack chain detected.</p>
            `;

        } else {

            attackChainHTML = detectedChain
                .map((step, index) => {

                    const box = `<div>${step.name}</div>`;

                    if (index < detectedChain.length - 1) {
                        return box + `<span>↓</span>`;
                    }

                    return box;

                })
                .join("");
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

                    ${attackChainHTML}

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