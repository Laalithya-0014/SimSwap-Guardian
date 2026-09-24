def calculate_risk(events):
    score = 0
    signals = []

    for event in events:
        event = event.lower()

        if "sim" in event and "replacement" in event:
            score += 30
            signals.append("SIM replacement request")

        if "otp" in event:
            score += 15
            signals.append("Multiple or unusual OTP activity")

        if "password" in event and "reset" in event:
            score += 15
            signals.append("Password reset attempt")

        if "unknown device" in event:
            score += 15
            signals.append("Login from unknown device")

        if "email" in event and "changed" in event:
            score += 20
            signals.append("Email address changed")

        if "phone" in event and "changed" in event:
            score += 20
            signals.append("Phone number changed")

    score = min(score, 100)

    if score <= 30:
        level = "LOW"
    elif score <= 60:
        level = "MEDIUM"
    elif score <= 80:
        level = "HIGH"
    else:
        level = "CRITICAL"

    return {
        "score": score,
        "level": level,
        "signals": list(set(signals))
    }