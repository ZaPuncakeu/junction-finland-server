import uuid
from editor import edit_videos
from image_junction import generate_image
from flask import Flask, request
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
cors = CORS(app)

@app.route("/generate", methods=["POST"])
def generate_video():
    data = json.loads(request.data)
    return edit_videos(data["id"], data["files"])
#edit_video(str(uuid.uuid4()), "league of legends esport")

@app.route("/generate-image", methods=["POST"])
def generate_image_request():
    data = json.loads(request.data)
    return generate_image(data["path"], data["context"])