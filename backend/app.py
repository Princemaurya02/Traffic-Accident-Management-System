from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from routes.traffic_routes import traffic_bp
app.register_blueprint(traffic_bp, url_prefix="/api/traffic")

@app.route("/")
def home():
    return "Backend is running"

if __name__ == "__main__":
    app.run(debug=True)
