from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from services.pipeline import run_pipeline, run_inject, run_drop
import traceback

app = Flask(__name__)
CORS(app)

# Insert data
@app.route("/insert", methods=["POST"])
def insert():
    if "file" not in request.files:
        return jsonify({"error": "CSV not sent"}), 400
    
    file = request.files["file"]

    if not file.filename:
        return jsonify({"error": "No file selected"}), 400

    filename = file.filename

    if not filename.lower().endswith(".csv"):
        return jsonify({"error": "File must be a CSV"}), 400

    try:
        result = run_pipeline(file)
        return jsonify(result), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({ "error": str(e) }), 500

# Inject data
@app.route("/inject/<filename>", methods=["GET"])
def inject(filename):
    try:
        result = run_inject(filename)

        return Response(
            result["csv"],
            mimetype="text/csv",
            headers={
                "Content-Disposition": (
                    f'attachment; filename="{result["filename"]}"'
                )
            }
        )

    except ValueError as e:
        return jsonify({ "error": str(e) }), 404

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

# Reset data
@app.route("/reset", methods=["POST"])
def reset():
    data = request.get_json()

    if not data or "filename" not in data:
        return jsonify({ "error": "Filename not provided" }), 400

    filename = data["filename"]

    try:
        result = run_drop(filename)

        if result.deleted_count == 0:
            return jsonify({
                "error": "Dataset not found"
            }), 404
        
        return jsonify({
            "message": f"Dataset '{filename}' deleted"
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)