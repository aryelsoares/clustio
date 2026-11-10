# Clustering API
import numpy as np
import pandas as pd
import time
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN, OPTICS, SpectralClustering
from sklearn.mixture import GaussianMixture
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
from api.constants import *

def valid_labels(labels):
    unique = np.unique(labels)
    return 1 < len(unique) < len(labels)

def valid_density_labels(labels):
    unique = set(labels)
    if -1 in unique:
        unique.remove(-1)
    return len(unique) >= 2

def k_distance(x, k):
    nn = NearestNeighbors(n_neighbors=k)
    nn.fit(x)

    distances, _ = nn.kneighbors(x)
    k_distances = np.sort(distances[:, -1])

    curvature = np.diff(np.diff(k_distances))
    idx = np.argmax(curvature)

    return k_distances[idx + 1]

def estimate_min_samples(x, k_range=(MIN_K, MAX_K + 1)):
    scores = []

    for k in k_range:
        nn = NearestNeighbors(n_neighbors=k)
        nn.fit(x)
        distances, _ = nn.kneighbors(x)

        k_distances = np.sort(distances[:, -1])

        curvature = np.diff(np.diff(k_distances))
        score = np.max(curvature)

        scores.append((k, score))
    
    best_k = max(scores, key=lambda x: x[1])[0]
    return best_k

class Clustio:
    def __init__(self, data):
        self.scaler = StandardScaler()
        self.data = self.scaler.fit_transform(data)

        self.pca = None
        self.source = data.copy()

        if self.data.shape[1] > 2:
            self.pca = PCA(n_components=2)
            self.source = self.pca.fit_transform(self.data)

    # KMeans
    def KMeans(self):
        start = time.perf_counter()
        results = []

        for k in range(MIN_K, MAX_K + 1):
            try:
                kmeans = KMeans(
                    n_clusters=k,
                    n_init=10,
                    random_state=42
                )

                labels = kmeans.fit_predict(self.data)

                if not valid_labels(labels):
                    continue

                ss = silhouette_score(self.data, labels)
                results.append({
                    "k": k,
                    "SS": ss
                })

            except Exception as e:
                print(f"Model error: {e}")
                continue

        if not results:
            return {
                "model": "kmeans",
                "time": 0.0,
                "clusters": 0,
                "labels": [],
                "centroids": [],
                "metrics": {
                    "SS": 0.0,
                    "DBI": 0.0,
                    "CH": 0.0
                }
            }
        
        best = max(results, key=lambda x: x["SS"])
        
        kmeans = KMeans(
            n_clusters=best["k"],
            n_init=10,
            random_state=42
        ).fit(self.data)

        labels = kmeans.labels_

        if self.pca is not None:
            centroids = self.pca.transform(kmeans.cluster_centers_)
        else:
            centroids = self.scaler.inverse_transform(kmeans.cluster_centers_)

        end = time.perf_counter()

        return {
            "model": "kmeans",
            "time": float(round(end - start, ROUND_VALUE)),
            "clusters": len(set(labels)),
            "labels": labels.tolist(),
            "centroids": centroids.tolist(),
            "metrics": {
                "SS": float(round(best["SS"], ROUND_VALUE)),
                "DBI": float(round(davies_bouldin_score(self.data, labels), ROUND_VALUE)),
                "CH": float(round(calinski_harabasz_score(self.data, labels), ROUND_VALUE))
            }
        }
    
    # HIERARCHICAL
    def Hierarchical(self):
        start = time.perf_counter()
        results = []

        for k in range(MIN_K, MAX_K + 1):
            for method in HIERARCHICAL_METHODS:
                try:
                    hierarchical = AgglomerativeClustering(
                        n_clusters=k,
                        linkage=method, # type: ignore
                    )
                    
                    labels = hierarchical.fit_predict(self.data)

                    if not valid_labels(labels):
                        continue

                    ss = silhouette_score(self.data, labels)

                    results.append({
                        "k": k,
                        "method": method,
                        "SS": ss
                    })
                
                except Exception as e:
                    print(f"Model error: {e}")
                    continue

        if not results:
            return {
                "model": "hierarchical",
                "time": 0.0,
                "params": {
                    "method": "ward"
                },
                "clusters": 0,
                "labels": [],
                "metrics": {
                    "SS": 0.0,
                    "DBI": 0.0,
                    "CH": 0.0
                }
            }

        best = max(results, key=lambda x: x["SS"])

        hierarchical = AgglomerativeClustering(
            n_clusters=best["k"],
            linkage=best["method"]
        )

        labels = hierarchical.fit_predict(self.data)
        end = time.perf_counter()

        return {
            "model": "hierarchical",
            "time": float(round(end - start, ROUND_VALUE)),
            "params": {
                "method": best["method"]
            },
            "clusters": len(set(labels)),
            "labels": labels.tolist(),
            "metrics": {
                "SS": float(round(best["SS"], ROUND_VALUE)),
                "DBI": float(round(davies_bouldin_score(self.data, labels), ROUND_VALUE)),
                "CH": float(round(calinski_harabasz_score(self.data, labels), ROUND_VALUE))
            }
        }
    
    # DBSCAN
    def DBSCAN(self):
        start = time.perf_counter()
        results = []

        for min_sample in range(2, int(np.sqrt(len(self.data))) + 1):
            k = min_sample
            eps_base = k_distance(self.data, k)

            for eps in np.linspace(0.8 * eps_base, 1.2 * eps_base, 10):
                try:
                    dbscan = DBSCAN(
                        eps=eps,
                        min_samples=min_sample
                    )

                    labels = dbscan.fit_predict(self.data)

                    if not valid_density_labels(labels):
                        continue

                    mask = labels != -1
                    ss = silhouette_score(self.data[mask], labels[mask])
                    noise_ratio = np.mean(labels == -1)

                    results.append({
                        "eps": eps,
                        "min_samples": min_sample,
                        "SS": ss * (1 - noise_ratio)
                    })
                
                except Exception as e:
                    print(f"Model error: {e}")
                    continue

        if not results:
            return {
                "model": "dbscan",
                "time": 0.0,
                "params": {
                    "min_samples": 0,
                    "eps": 0
                },
                "clusters": 0,
                "labels": [],
                "metrics": {
                    "SS": 0.0,
                    "DBI": 0.0,
                    "CH": 0.0
                }
            }

        best = max(results, key=lambda x: x["SS"])

        dbscan = DBSCAN(
            eps=best["eps"],
            min_samples=best["min_samples"]
        )

        labels = dbscan.fit_predict(self.data)
        mask = labels != -1

        end = time.perf_counter()

        return {
            "model": "dbscan",
            "time": float(round(end - start, ROUND_VALUE)),
            "params": {
                "min_samples": best["min_samples"],
                "eps": round(best["eps"], ROUND_VALUE)
            },
            "clusters": len(set(labels) - {-1}),
            "labels": labels.tolist(),
            "metrics": {
                "SS": float(round(best["SS"], ROUND_VALUE)),
                "DBI": float(round(davies_bouldin_score(self.data[mask], labels[mask]), 2)),
                "CH": float(round(calinski_harabasz_score(self.data[mask], labels[mask]), 2))
            }
        }
    
    # OPTICS
    def OPTICS(self):
        start = time.perf_counter()
        results = []

        k_base = estimate_min_samples(self.data, range(MIN_K, MAX_K + 1))

        min_samples = range(max(2, k_base - 2), k_base + 3)

        for min_sample in min_samples:
            for xi in OPTICS_XIS:
                for min_k_size in OPTICS_MIN_K_SIZES:
                    try:
                        optics = OPTICS(
                            min_samples=min_sample,
                            xi=xi,
                            min_cluster_size=min_k_size,
                            metric="euclidean"
                        )

                        labels = optics.fit_predict(self.data)

                        if not valid_density_labels(labels):
                            continue

                        mask = labels != -1
                        ss = silhouette_score(self.data[mask], labels[mask])
                        noise_ratio = np.mean(labels == -1)

                        results.append({
                            "min_samples": min_sample,
                            "xi": xi,
                            "min_k_size": min_k_size,
                            "SS": ss * (1 - noise_ratio)
                        })
                    
                    except Exception as e:
                        print(f"Model error: {e}")
                        continue

        if not results:
            return {
                "model": "optics",
                "time": 0.0,
                "params": {
                    "min_samples": 0,
                    "xi": 0,
                    "min_k_size": 0
                },
                "clusters": 0,
                "labels": [],
                "metrics": {
                    "SS": 0.0,
                    "DBI": 0.0,
                    "CH": 0.0
                }
            }
        
        best = max(results, key=lambda x: x["SS"])

        optics = OPTICS(
            min_samples=best["min_samples"],
            xi=best["xi"],
            min_cluster_size=best["min_k_size"]
        )

        labels = optics.fit_predict(self.data)
        mask = labels != -1

        end = time.perf_counter()

        return {
            "model": "optics",
            "time": float(round(end - start, ROUND_VALUE)),
            "params": {
                "min_samples": best["min_samples"],
                "xi": best["xi"],
                "min_k_size": best["min_k_size"]
            },
            "clusters": len(set(labels) - {-1}),
            "labels": labels.tolist(),
            "metrics": {
                "SS": float(round(best["SS"], ROUND_VALUE)),
                "DBI": float(round(davies_bouldin_score(self.data[mask], labels[mask]), ROUND_VALUE)),
                "CH": float(round(calinski_harabasz_score(self.data[mask], labels[mask]), ROUND_VALUE))
            }
        }
    
    # GMM
    def GMM(self):
        start = time.perf_counter()
        results = []

        for k in range(MIN_K, MAX_K + 1):
            try:
                bic_per_cov = []

                for cov in GMM_COVS:
                    gmm = GaussianMixture(
                        n_components=k,
                        covariance_type=cov, # type: ignore
                        n_init=20,
                        random_state=42
                    )
                    gmm.fit(self.data)

                    bic_per_cov.append(gmm.bic(self.data))
            
                best_cov = GMM_COVS[bic_per_cov.index(min(bic_per_cov))]

                gmm = GaussianMixture(
                    n_components=k,
                    covariance_type=best_cov, # type: ignore
                    n_init=20,
                    random_state=42
                )

                labels = gmm.fit_predict(self.data)

                if not valid_labels(labels):
                    continue

                ss = silhouette_score(self.data, labels)

                results.append({
                    "k": k,
                    "covariance": best_cov,
                    "SS": ss,
                })

            except Exception as e:
                print(f"Model error: {e}")
                continue
        
        if not results:
            return {
                "model": "gmm",
                "time": 0.0,
                "params": {
                    "covariance": "full"
                },
                "clusters": 0,
                "labels": [],
                "metrics": {
                    "SS": 0.0,
                    "DBI": 0.0,
                    "CH": 0.0
                }
            }
        
        best = max(results, key=lambda x: x["SS"])

        gmm = GaussianMixture(
            n_components=best["k"],
            covariance_type=best["covariance"],
            n_init=20,
            random_state=42
        )

        labels = gmm.fit_predict(self.data)

        end = time.perf_counter()
        return {
            "model": "gmm",
            "time": float(round(end - start, ROUND_VALUE)),
            "params": {
                "covariance": best["covariance"]
            },
            "clusters": len(set(labels)),
            "labels": labels.tolist(),
            "metrics": {
                "SS": float(round(best["SS"], ROUND_VALUE)),
                "DBI": float(round(davies_bouldin_score(self.data, labels), ROUND_VALUE)),
                "CH": float(round(calinski_harabasz_score(self.data, labels), ROUND_VALUE))
            }
        }
    
    # Spectral
    def Spectral(self):
        start = time.perf_counter()
        results = []

        for k in range(MIN_K, MAX_K + 1):
            for affinity in SPECTRAL_AFFINITIES:
                for gamma in SPECTRAL_GAMMAS if affinity == "rbf" else [None]:
                    try:
                        spectral = SpectralClustering(
                            n_clusters=k,
                            affinity=affinity,
                            gamma=gamma, # type: ignore
                            random_state=42
                        )

                        labels = spectral.fit_predict(self.data)

                        if not valid_labels(labels):
                            continue

                        ss = silhouette_score(self.data, labels)

                        results.append({
                            "k": k,
                            "affinity": affinity,
                            "gamma": gamma,
                            "SS": ss
                        })

                    except Exception as e:
                        print(f"Model error: {e}")
                        continue

        if not results:
            return {
                "model": "Spectral",
                "time": 0.0,
                "params": {
                    "affinity": "rbf",
                    "gamma": 0
                },
                "clusters": 0,
                "labels": [],
                "metrics": {
                    "SS": 0.0,
                    "DBI": 0.0,
                    "CH": 0.0
                }
            }
        
        best = max(results, key=lambda x: x["SS"])

        spectral = SpectralClustering(
            n_clusters=best["k"],
            affinity=best["affinity"],
            gamma=best["gamma"],
            random_state=42
        )

        labels = spectral.fit_predict(self.data)

        end = time.perf_counter()

        return {
            "model": "Spectral",
            "time": float(round(end - start, ROUND_VALUE)),
            "params": {
                "affinity": best["affinity"],
                "gamma": best["gamma"]
            },
            "clusters": len(set(labels)),
            "labels": labels.tolist(),
            "metrics": {
                "SS": float(round(best["SS"], ROUND_VALUE)),
                "DBI": float(round(davies_bouldin_score(self.data, labels), ROUND_VALUE)),
                "CH": float(round(calinski_harabasz_score(self.data, labels), ROUND_VALUE))
            }
        }

class Score:
    def __init__(self, models: list):
        self.models = [
            model for model in models
            if model is not None
        ]

        self.valid_models = [
            model for model in self.models
            if len(model.get("labels", [])) > 0
            and model.get("clusters", 0) >= 2
        ]

        self.df = pd.DataFrame()
    
    def fit(self):
        if not self.models:
            raise ValueError("No valid clustering models were found")

        self.df = pd.DataFrame([
            {
                "model": r["model"],
                "SS": r["metrics"]["SS"],
                "DBI": r["metrics"]["DBI"],
                "CH": r["metrics"]["CH"]
            }
            for r in self.models
        ])

        self.df["SS"] = MinMaxScaler().fit_transform(self.df[["SS"]])
        self.df["DBI"] = 1 - MinMaxScaler().fit_transform(self.df[["DBI"]])
        self.df["CH"] = MinMaxScaler().fit_transform(self.df[["CH"]])

        self.df["score"] = self.df[["SS", "DBI", "CH"]].mean(axis=1)

        return self

    def results(self):
        scores = dict(zip(self.df["model"], self.df["score"]))

        return {
            r["model"].lower(): {
                **r,
                "score": float(round(scores[r["model"]], ROUND_VALUE))
            } if r in self.valid_models else {
                **r,
                "score": 0.0
            }
            for r in self.models
        }