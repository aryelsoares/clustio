// Data Types

interface DataMetrics {
  SS: number;
  DBI: number;
  CH: number;
};

export interface Result {
  filename: string;
  headers: string[];
  data: number[][];
  models: {
    kmeans: {
      time: number;
      clusters: number;
      labels: number[];
      centroids: number[][];
      metrics: DataMetrics;
      score: number;
    },
    hierarchical: {
      time: number;
      params: { method: string };
      clusters: number;
      labels: number[];
      metrics: DataMetrics;
      score: number;
    },
    dbscan: {
      time: number;
      params: { min_samples: number, eps: number };
      clusters: number;
      labels: number[];
      metrics: DataMetrics;
      score: number;
    },
    optics: {
      time: number;
      params: { min_samples: number, xi: number, min_k_size: number };
      clusters: number;
      labels: number[];
      metrics: DataMetrics;
      score: number;
    },
    gmm: {
      time: number;
      params: { covariance: string };
      clusters: number;
      labels: number[];
      metrics: DataMetrics;
      score: number;
    },
    spectral: {
      time: number;
      params: { affinity: string, gamma: number };
      clusters: number;
      labels: number[];
      metrics: DataMetrics;
      score: number;
    }
  }
};