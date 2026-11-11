"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Charts from "@/components/Charts";
import { Result } from "@/types/data";
import { processCSV, injectCSV, resetCSV } from "@/services/api";

const emptyData: Result = {
    "filename": "None",
    "headers": [
        "Dim 1", "Dim 2"
    ],
    "data": [] as number[][],
    "models": {
        "kmeans": {
            time: 0,
            clusters: 0,
            labels: [] as number[],
            centroids: [] as number[][],
            metrics: {
                "SS": 0,
                "DBI": 0,
                "CH": 0
            },
            score: 0
        },
        "hierarchical": {
            time: 0,
            params: {
                "method": "ward"
            },
            clusters: 0,
            labels: [] as number[],
            metrics: {
                "SS": 0,
                "DBI": 0,
                "CH": 0
            },
            score: 0
        },
        "dbscan": {
            time: 0,
            params: {
                "min_samples": 0,
                "eps": 0
            },
            clusters: 0,
            labels: [] as number[],
            metrics: {
                "SS": 0,
                "DBI": 0,
                "CH": 0
            },
            score: 0
        },
        "optics": {
            time: 0,
            params: {
                "min_samples": 0,
                "xi": 0,
                "min_k_size": 0
            },
            clusters: 0,
            labels: [] as number[],
            metrics: {
                "SS": 0,
                "DBI": 0,
                "CH": 0
            },
            score: 0
        },
        "gmm": {
            time: 0,
            params: {
                "covariance": "diag"
            },
            clusters: 0,
            labels: [] as number[],
            metrics: {
                "SS": 0,
                "DBI": 0,
                "CH": 0
            },
            score: 0
        },
        "spectral": {
            time: 0,
            params: {
                "affinity": "rbf",
                "gamma": 0
            },
            clusters: 0,
            labels: [] as number[],
            metrics: {
                "SS": 0,
                "DBI": 0,
                "CH": 0
            },
            score: 0
        }
    }
};

export default function Home() {
  const [hasData, setHasData] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
  const [result, setResult] = useState<Result>(emptyData);

  async function handleInsert(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setLoadingButton("Insert");

    try {
        const data = await processCSV(file);

        setResult(data);
        setHasData(true);
    } catch (error) {
        console.error(error);
    } finally {
        setLoadingButton(null);
    }
  }

  async function handleInject() {
    if (!result?.filename) return;

    setLoadingButton("Inject");

    try {
        await injectCSV(result.filename);
    } catch (error) {
        console.error(error);
    } finally {
        setLoadingButton(null)
    }
  }

  async function handleReset() {
    if (!result?.filename) return;

    setLoadingButton("Reset");

    try {
        await resetCSV(result.filename);
        setResult(emptyData);
    } catch (error) {
        console.error(error);
    } finally {
        setResult(emptyData);
        setHasData(false);
        setLoadingButton(null);
    }
  }

  return (
    <>
      <Header filename={result.filename} onInsert={handleInsert} onInject={handleInject} onReset={handleReset} loading={loadingButton} filled={hasData} />
      <main className="bg-fixed bg-center bg-cover">
        <Charts result={result} />
      </main>
    </>
  );
}
