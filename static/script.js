async function analyzeEvents() {

    const checkboxes = document.querySelectorAll(
        '.events input[type="checkbox"]:checked'
    );

    const events = Array.from(checkboxes).map(
        checkbox => checkbox.value
    );

    if (events.length === 0) {
        alert("Please select at least one security event.");
        return;
    }

    document.getElementById("loading").textContent =
        "Analyzing security activity...";

    document.getElementById("result").style.display = "none";

    try {

        const response = await fetch("/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                events: events
            })

        });

        const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(
                "Server did not return JSON. Check the Flask terminal."
            );
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Analysis failed");
        }

        // Display risk score
       // Update visual risk bar
       // Display risk score
document.getElementById("riskScore").textContent =
    data.risk_score;

// Update visual risk bar
const riskBar = document.getElementById("riskBarFill");

let score = Number(data.risk_score);

if (score < 0) {
    score = 0;
}

if (score > 100) {
    score = 100;
}


riskBar.style.width = score + "%";
        // Display risk level
        document.getElementById("riskLevel").textContent =
            data.risk_level;

        // Display signals
        const signalsList = document.getElementById("signals");
        signalsList.innerHTML = "";

        data.signals.forEach(signal => {
            const li = document.createElement("li");
            li.textContent = signal;
            signalsList.appendChild(li);
        });

        // Display Gemini analysis
        document.getElementById("analysis").textContent =
            data.analysis;

        // Update security recommendations
        updateSecurityActions(data.risk_level);

        // Show result
        document.getElementById("result").style.display = "block";

        document.getElementById("loading").textContent = "";

    } catch (error) {

        console.error(error);

        document.getElementById("loading").textContent =
            "Error: " + error.message;
    }
}


// Update recommendations based on risk level
function updateSecurityActions(riskLevel) {

    const actionsContainer =
        document.querySelector(".security-actions");

    if (!actionsContainer) {
        return;
    }

    if (riskLevel === "HIGH") {

        actionsContainer.innerHTML = `
            <div class="action-card">
                <h4>🚨 Secure the Account Immediately</h4>
                <p>Change the account password and review active sessions immediately.</p>
            </div>

            <div class="action-card">
                <h4>📱 Contact Your Mobile Carrier</h4>
                <p>Verify whether an unauthorized SIM replacement or transfer request was made.</p>
            </div>

            <div class="action-card">
                <h4>🛡️ Strengthen Authentication</h4>
                <p>Enable multi-factor authentication and update account recovery options.</p>
            </div>

            <div class="action-card">
                <h4>🔍 Review Security Activity</h4>
                <p>Check recent logins, password resets, and unusual OTP activity.</p>
            </div>
        `;

    } else if (riskLevel === "MEDIUM") {

        actionsContainer.innerHTML = `
            <div class="action-card">
                <h4>🔐 Review Account Security</h4>
                <p>Check your password and review recent account activity.</p>
            </div>

            <div class="action-card">
                <h4>📱 Verify SIM Activity</h4>
                <p>Check with your mobile carrier if any unexpected SIM activity occurred.</p>
            </div>

            <div class="action-card">
                <h4>🛡️ Enable Multi-Factor Authentication</h4>
                <p>Use an additional authentication method to protect the account.</p>
            </div>
        `;

    } else {

        actionsContainer.innerHTML = `
            <div class="action-card">
                <h4>👀 Monitor Account Activity</h4>
                <p>Continue monitoring login and account activity for unusual behavior.</p>
            </div>

            <div class="action-card">
                <h4>🔐 Maintain Account Security</h4>
                <p>Keep your password strong and your recovery information updated.</p>
            </div>

            <div class="action-card">
                <h4>🛡️ Keep Authentication Enabled</h4>
                <p>Continue using multi-factor authentication where available.</p>
            </div>
        `;
    }
}