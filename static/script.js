const eventsBox = document.getElementById("events");
const demoBtn = document.getElementById("demoBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultSection = document.getElementById("resultSection");
const riskLevel = document.getElementById("riskLevel");


// ============================================================
// DEMO SCENARIOS
// ============================================================

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

let lastDemoIndex = -1;


// ============================================================
// DEMO BUTTON
// ============================================================

demoBtn.addEventListener("click", function () {

    let randomIndex;

    do {
        randomIndex = Math.floor(
            Math.random() * demoScenarios.length
        );
    } while (
        demoScenarios.length > 1 &&
        randomIndex === lastDemoIndex
    );

    lastDemoIndex = randomIndex;

    eventsBox.value = demoScenarios[randomIndex].join("\n");
});


// ============================================================
// SMALL VISUAL ENHANCEMENTS
// ============================================================

const enhancementStyle = document.createElement("style");

enhancementStyle.textContent = `
    .incident-banner {
        background: #fff4f4;
        border: 1px solid #ffd0d0;
        border-radius: 12px;
        padding: 14px 18px;
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    }

    .incident-title {
        font-weight: 700;
        color: #b91c1c;
        font-size: 14px;
    }

    .incident-meta {
        font-size: 12px;
        color: #667085;
    }

    .processing-step {
        padding: 8px 0;
        opacity: 0;
        animation: trustguardFadeIn 0.4s forwards;
    }

    .attack-step {
        opacity: 0;
        transform: translateY(8px);
        animation: trustguardStepIn 0.45s forwards;
    }

    .risk-score-animated {
        transition: transform 0.2s;
    }

    .risk-score-animated.pulse {
        animation: trustguardPulse 0.8s ease-in-out;
    }

    @keyframes trustguardFadeIn {
        from {
            opacity: 0;
            transform: translateY(5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes trustguardStepIn {
        from {
            opacity: 0;
            transform: translateY(8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes trustguardPulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.06);
        }
    }
`;

document.head.appendChild(enhancementStyle);


// ============================================================
// INCIDENT ID
// ============================================================

function generateIncidentId() {

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let id = "";

    for (let i = 0; i < 6; i++) {
        id += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return "TG-" + id;
}


// ============================================================
// ANALYZE BUTTON
// ============================================================

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


    const events = rawEvents
        .split("\n")
        .map(event => event.trim())
        .filter(event => event.length > 0);


    // Disable button
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing...";


    // ========================================================
    // INCIDENT PROCESSING ANIMATION
    // ========================================================

    riskLevel.innerHTML = `
        <div class="analysis-box">

            <div class="incident-banner">

                <div>
                    <div class="incident-title">
                        🔴 LIVE SECURITY INCIDENT
                    </div>

                    <div class="incident-meta">
                        Incident ID: ${generateIncidentId()}
                    </div>
                </div>

                <div class="incident-meta">
                    ${events.length} security events detected
                </div>

            </div>

            <div class="processing-step" style="animation-delay:0.1s">
                🔍 Correlating security events...
            </div>

            <div class="processing-step" style="animation-delay:0.5s">
                ⚡ Evaluating threat signals...
            </div>

            <div class="processing-step" style="animation-delay:0.9s">
                🔗 Reconstructing possible attack chain...
            </div>

            <div class="processing-step" style="animation-delay:1.3s">
                🤖 Generating AI security assessment...
            </div>

        </div>
    `;

    resultSection.scrollIntoView({
        behavior: "smooth"
    });


    try {

        // Small visual delay so the processing sequence is visible
        await new Promise(resolve => setTimeout(resolve, 1600));


        // ====================================================
        // SEND EVENTS TO FLASK
        // ====================================================

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


        if (!response.ok) {

            throw new Error(
                data.error || "Server returned an error."
            );

        }


        // ====================================================
        // EXTRACT RESPONSE
        // ====================================================

        const score = data.risk_score;
        const level = data.risk_level;
        const signals = data.signals || [];
        const analysis = data.analysis || "No analysis available.";


        // ====================================================
        // SIGNALS
        // ====================================================

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


        // ====================================================
        // ATTACK CHAIN
        // ====================================================

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
            step.matches.some(match =>
                signals.includes(match)
            )
        );


        let attackChainHTML = "";

        if (detectedChain.length === 0) {

            attackChainHTML = `
                <p>No attack chain detected.</p>
            `;

        } else {

            attackChainHTML = detectedChain
                .map((step, index) => {

                    const delay = index * 0.25;

                    const box = `
                        <div
                            class="attack-step"
                            style="animation-delay:${delay}s"
                        >
                            ${step.name}
                        </div>
                    `;

                    if (index < detectedChain.length - 1) {

                        return box + `<span>↓</span>`;

                    }

                    return box;

                })
                .join("");

        }


        // ====================================================
        // RISK MESSAGE
        // ====================================================

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


        // ====================================================
        // DISPLAY RESULT
        // ====================================================

        riskLevel.innerHTML = `

            <div class="incident-banner">

                <div>

                    <div class="incident-title">
                        🔴 LIVE SECURITY INCIDENT
                    </div>

                    <div class="incident-meta">
                        Incident ID: ${generateIncidentId()}
                    </div>

                </div>

                <div class="incident-meta">
                    ${events.length} security events correlated
                </div>

            </div>


            <div class="risk-header">

                <div>

                    <h3>🔴 ${level} RISK</h3>

                    <p>${riskMessage}</p>

                </div>


                <div class="risk-score risk-score-animated">

                    <span id="animatedScore">0</span>
                    <span>/100</span>

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


        // ====================================================
        // ANIMATE SCORE
        // ====================================================

        const scoreElement =
            document.getElementById("animatedScore");

        let currentScore = 0;

        const increment = Math.max(
            1,
            Math.ceil(score / 35)
        );

        const scoreTimer = setInterval(() => {

            currentScore += increment;

            if (currentScore >= score) {

                currentScore = score;

                clearInterval(scoreTimer);

                const scoreContainer =
                    document.querySelector(
                        ".risk-score-animated"
                    );

                if (scoreContainer) {

                    scoreContainer.classList.add("pulse");

                }

            }

            scoreElement.textContent = currentScore;

        }, 25);


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