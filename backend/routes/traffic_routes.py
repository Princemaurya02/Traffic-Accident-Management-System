from flask import Blueprint
from flask import jsonify
from controllers.traffic_controllers import get_traffic_status

traffic_bp = Blueprint("traffic", __name__)

@traffic_bp.route("/status", methods=["GET"])
def traffic_status():
    return get_traffic_status()

@traffic_bp.route("/map-points", methods=["GET"])
def map_points():
    data = [
        {"lat": 19.0760, "lng": 72.8777, "type": "accident"},
        {"lat": 19.0820, "lng": 72.8700, "type": "traffic"},
        {"lat": 19.0700, "lng": 72.8800, "type": "safe"}
    ]
    return jsonify(data)
