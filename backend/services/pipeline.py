import os
import pandas as pd
from pymongo import MongoClient
from api.clusters import Clustio, Score

MONGODB_URL = os.getenv(
    "MONGODB_URL",
    "mongodb://localhost:27017"
)

# Validate labels
def validate_models(models):
    for name, result in models.items():
        labels = result.get("labels")
        valid = (labels is not None and len(labels) > 0)

        if not valid:
            return

    return models

# Format frontend response
def format_response(document, cached):
    hasPCA = len(document["headers"]) > 2

    return {
        "filename": document["filename"],
        "headers": ["Dim 1", "Dim 2"] if hasPCA else document["headers"],
        "data": document["data"],
        "models": document["models"],
        "cached": cached
    }

# Insert
def run_pipeline(file, mongo_url=MONGODB_URL):
    mongo = MongoClient(mongo_url)

    try:
        csv_name = file.filename

        db = mongo["clustio"]
        collection = db["datasets"]

        # Check cache
        cached_document = collection.find_one({
            "filename": csv_name
        })

        if cached_document:
            return format_response(cached_document, True)

        # Read CSV
        df = pd.read_csv(file)

        data = df.values.tolist()
        clustio = Clustio(data)

        models = [
            clustio.KMeans(), clustio.Hierarchical(), clustio.DBSCAN(),
            clustio.OPTICS(), clustio.GMM(), clustio.Spectral()
        ]

        scorer = Score(models)
        scorer.fit()

        results = scorer.results()

        document = {
            "filename": csv_name,
            "headers": df.columns.tolist(),
            "src": df.values.tolist(),
            "data": clustio.source,
            "models": results
        }

        # Save to MongoDB
        collection.insert_one(document)

        return format_response(document, False)

    finally:
        mongo.close()

# Inject
def run_inject(filename):
    mongo = MongoClient(MONGODB_URL)

    try:
        db = mongo["clustio"]
        collection = db["datasets"]

        document = collection.find_one(
            {"filename": filename},
            {"_id": 0}
        )

        if document is None:
            raise ValueError("Dataset not found.")

        models = document["models"]

        valid_models = {
            name: result
            for name, result in models.items()
            if result.get("labels") is not None
        }

        if not valid_models:
            raise ValueError("No valid clustering models found.")

        # Get best model
        _, model_results = max(
            models.items(),
            key=lambda item: item[1]["score"]
        )

        # Reconstruct DataFrame
        df = pd.DataFrame(
            document["src"],
            columns=document["headers"]
        )

        # Add cluster labels
        df["Group"] = model_results["labels"]

        return {
            "filename": filename.rsplit(".", 1)[0] + "_clustered.csv",
            "csv": df.to_csv(index=False)
        }

    finally:
        mongo.close()

# Reset
def run_drop(filename):
    mongo = MongoClient(MONGODB_URL)

    try:
        db = mongo["clustio"]

        result = db["datasets"].delete_one({
            "filename": filename
        })

        return result

    finally:
        mongo.close()