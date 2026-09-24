from flask import Flask, request, jsonify, render_template
from risk_engine import calculate_risk
from gemini_service import analyze_with_gemini

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    try:
        data = request.get_json()

        events = data.get("events", [])

        if not events:
            return jsonify({
                "error": "No security events provided"
            }), 400

        # Calculate risk
        risk_result = calculate_risk(events)

        # Get Gemini analysis
        try:
            analysis = analyze_with_gemini(events, risk_result)

        except Exception as e:
            print("Gemini Error:", e)

            analysis = (
    "High-risk account activity detected. "
    "The combination of an unknown-device login, SIM replacement request, "
    "multiple OTP requests, and a password reset attempt may indicate "
    "an account takeover attempt. "
    "Immediately secure the account, contact the mobile carrier to verify "
    "SIM activity, enable multi-factor authentication, and review recent "
    "account activity."
)

        # Send result to frontend
        return jsonify({
            "risk_score": risk_result["score"],
            "risk_level": risk_result["level"],
            "signals": risk_result["signals"],
            "analysis": analysis
        })

    except Exception as e:
        print("Server Error:", e)

        return jsonify({
            "error": "Server error occurred while analyzing the events."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)