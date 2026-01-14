from flask import jsonify
import random

def get_traffic_status():
    congestion_levels = ["Low", "Medium", "High"]
    risk_levels = ["Safe", "Risky"]

    data = {
        "congestion": random.choice(congestion_levels),
        "risk": random.choice(risk_levels)
    }

    return jsonify(data)
