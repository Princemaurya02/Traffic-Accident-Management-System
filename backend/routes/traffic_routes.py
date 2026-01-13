from flask import Blueprint, jsonify

traffic_bp = Blueprint("traffic", __name__)

@traffic_bp.route("/status", methods=["GET"])
def traffic_status():
    data = {
        "congestion": "Low",
        "risk": "Safe"
    }
    return jsonify(data)
