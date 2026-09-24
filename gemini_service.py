import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is missing from the .env file")

client = genai.Client(api_key=api_key)


def analyze_with_gemini(events, risk_result):

    prompt = f"""
You are a cybersecurity assistant for a SIM-swap and account-takeover
detection system.

Security events:
{events}

Risk score: {risk_result["score"]}
Risk level: {risk_result["level"]}

Explain:
1. Why the activity is suspicious
2. The possible attack sequence
3. Recommended defensive actions

Keep the explanation clear and suitable for a security dashboard.

Do not provide instructions for carrying out an attack.
"""

    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=prompt
    )

    return response.text