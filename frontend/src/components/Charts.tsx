// Charts
"use client";

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faSitemap, faDrawPolygon, faMagnifyingGlass, faBellConcierge, faWaveSquare, faClock, faSliders, faCircleNodes, faChartLine, faChartSimple } from "@fortawesome/free-solid-svg-icons";

import { Result } from "../types/data";

import dynamic from "next/dynamic";
import type { Data, Layout } from "plotly.js";
const Plot = dynamic(() => import("react-plotly.js"), {
    ssr: false
});

const GRID_COLOR = "#3a3d45";
const TEXT_COLOR = "#f4f6f8";
const PLOT_SIZE = { width: "600px", height: "300px" };

interface ClusterData {
    headers: string[];
    source: number[][];
    labels: number[];
}

interface KMeansData extends ClusterData {
    centroids: number[][];
}

// KMeans
export function KMeansPlot({ headers, source, labels, centroids }: KMeansData) {
    const clusters = [...new Set(labels)];

    const traces: Data[] = clusters.map(cluster => {
        const points = source.filter((_, i) => labels[i] === cluster);

        return {
            x: points.map(p => p[0]),
            y: points.map(p => p[1]),
            type: "scatter",
            mode: "markers",
            name: `Cluster ${cluster}`,
            marker: {
                size: 8
            }
        }
    });

    traces.push({
        x: centroids.map(c => c[0]),
        y: centroids.map(c => c[1]),
        type: "scatter",
        mode: "markers",
        name: "Centroids",
        marker: {
            symbol: "x",
            size: 16,
            color: "red"
        }
    });

    const layout: Partial<Layout> = {
        xaxis: { title: { text: headers[0] }, gridcolor: GRID_COLOR },
        yaxis: { title: { text: headers[1] }, gridcolor: GRID_COLOR },
        margin: {t: 10, b: 40},
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: { color: TEXT_COLOR },
        hovermode: "closest"
    };

    return (
        <Plot
            data={traces}
            layout={layout}
            style={PLOT_SIZE}
            useResizeHandler
        />
    );
}

// Hierarchical
export function HierarchicalPlot({ headers, source, labels }: ClusterData) {
    const clusters = [...new Set(labels)];

    const traces: Data[] = clusters.map(cluster => {
        const points = source.filter((_, i) => labels[i] === cluster);

        return {
            x: points.map(p => p[0]),
            y: points.map(p => p[1]),
            type: "scatter",
            mode: "markers",
            name: `Cluster ${cluster}`,
            marker: {
                size: 8
            }
        }
    });

    const layout: Partial<Layout> = {
        xaxis: { title: { text: headers[0] }, gridcolor: GRID_COLOR },
        yaxis: { title: { text: headers[1] }, gridcolor: GRID_COLOR },
        margin: {t: 10, b: 40},
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: { color: TEXT_COLOR },
        hovermode: "closest"
    };

    return (
        <Plot
            data={traces}
            layout={layout}
            style={PLOT_SIZE}
            useResizeHandler
        />
    );
}

// DBSCAN
export function DBSCANPlot({ headers, source, labels }: ClusterData) {
    const clusters = [...new Set(labels)];

    const traces: Data[] = clusters.map(cluster => {
        const points = source.filter((_, i) => labels[i] === cluster);

        return {
            x: points.map(p => p[0]),
            y: points.map(p => p[1]),
            type: "scatter",
            mode: "markers",
            name: cluster === -1 ? "Noise" : `Cluster ${cluster}`,
            marker: {
                size: 8,
                color: cluster === -1 ? "#A9A9A9" : undefined
            }
        }
    });

    const layout: Partial<Layout> = {
        xaxis: { title: { text: headers[0] }, gridcolor: GRID_COLOR },
        yaxis: { title: { text: headers[1] }, gridcolor: GRID_COLOR },
        margin: {t: 10, b: 40},
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: { color: TEXT_COLOR },
        hovermode: "closest"
    };

    return (
        <Plot
            data={traces}
            layout={layout}
            style={PLOT_SIZE}
            useResizeHandler
        />
    );
}

// Optics
export function OpticsPlot({ headers, source, labels }: ClusterData) {
    const clusters = [...new Set(labels)];

    const traces: Data[] = clusters.map(cluster => {
        const points = source.filter((_, i) => labels[i] === cluster);

        return {
            x: points.map(p => p[0]),
            y: points.map(p => p[1]),
            type: "scatter",
            mode: "markers",
            name: cluster === -1 ? "Noise" : `Cluster ${cluster}`,
            marker: {
                size: 8,
                color: cluster === -1 ? "#A9A9A9" : undefined
            }
        }
    });

    const layout: Partial<Layout> = {
        xaxis: { title: { text: headers[0] }, gridcolor: GRID_COLOR },
        yaxis: { title: { text: headers[1] }, gridcolor: GRID_COLOR },
        margin: {t: 10, b: 40},
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: { color: TEXT_COLOR },
        hovermode: "closest"
    };

    return (
        <Plot
            data={traces}
            layout={layout}
            style={PLOT_SIZE}
            useResizeHandler
        />
    );
}

// GMM
export function GMMPlot({ headers, source, labels }: ClusterData) {
    const clusters = [...new Set(labels)];

    const traces: Data[] = clusters.map(cluster => {
        const points = source.filter((_, i) => labels[i] === cluster);

        return {
            x: points.map(p => p[0]),
            y: points.map(p => p[1]),
            type: "scatter",
            mode: "markers",
            name: `Cluster ${cluster}`,
            marker: {
                size: 8
            }
        }
    });

    const layout: Partial<Layout> = {
        xaxis: { title: { text: headers[0] }, gridcolor: GRID_COLOR },
        yaxis: { title: { text: headers[1] }, gridcolor: GRID_COLOR },
        margin: {t: 10, b: 40},
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: { color: TEXT_COLOR },
        hovermode: "closest"
    };

    return (
        <Plot
            data={traces}
            layout={layout}
            style={PLOT_SIZE}
            useResizeHandler
        />
    );
}

// Spectral
export function SpectralPlot({ headers, source, labels }: ClusterData) {
    const clusters = [...new Set(labels)];

    const traces: Data[] = clusters.map(cluster => {
        const points = source.filter((_, i) => labels[i] === cluster);

        return {
            x: points.map(p => p[0]),
            y: points.map(p => p[1]),
            type: "scatter",
            mode: "markers",
            name: `Cluster ${cluster}`,
            marker: {
                size: 8
            }
        }
    });

    const layout: Partial<Layout> = {
        xaxis: { title: { text: headers[0] }, gridcolor: GRID_COLOR },
        yaxis: { title: { text: headers[1] }, gridcolor: GRID_COLOR },
        margin: {t: 10, b: 40},
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: { color: TEXT_COLOR },
        hovermode: "closest"
    };

    return (
        <Plot
            data={traces}
            layout={layout}
            style={PLOT_SIZE}
            useResizeHandler
        />
    );
}

interface ClusterModelProps {
    title: string;
    icon: IconDefinition;
    children: React.ReactNode;
    metrics: React.ReactNode;
}

function ClusterModel({
    title,
    icon,
    children,
    metrics
}: ClusterModelProps) {
    return (
        <div className="flex flex-col items-center justify-center text-[1.2rem]">
            <p className="flex items-center justify-center gap-2 text-2xl font-semibold">
                <FontAwesomeIcon icon={icon} />
                <span className="text-main">{title}</span>
            </p>

            {children}

            <div className="mt-8 mb-12 flex items-center justify-center gap-4">
                {metrics}
            </div>
        </div>
    );
}

interface MetricProps {
    icon: IconDefinition;
    label: string;
    value: React.ReactNode;
}

function Metric({ icon, label, value }: MetricProps) {
    return (
        <div>
            <FontAwesomeIcon icon={icon} />
            <span className="ml-1 text-gray-400">{label}</span>{": "}
            <span className="font-semibold">{value}</span>
        </div>
    );
}

interface ChartsProps {
    result: Result;
}

// Graphics
export default function Charts({ result }: ChartsProps) {
    const headers = result.headers;
    const data = result.data;
    const kmeans = result.models.kmeans;
    const hierarchical = result.models.hierarchical;
    const dbscan = result.models.dbscan;
    const optics = result.models.optics;
    const gmm = result.models.gmm;
    const spectral = result.models.spectral;

    const models = [
        {
            title: "K-Means++",
            icon: faBullseye,
            plot: (
                <KMeansPlot
                    headers={headers}
                    source={data}
                    labels={kmeans.labels}
                    centroids={kmeans.centroids}
                />
            ),
            time: kmeans.time.toFixed(2),
            clusters: kmeans.clusters,
            labels: kmeans.labels,
            metrics: kmeans.metrics,
            score: kmeans.score
        },
        {
            title: "Hierarchical Clustering",
            icon: faSitemap,
            plot: (
                <HierarchicalPlot
                    headers={headers}
                    source={data}
                    labels={hierarchical.labels}
                />
            ),
            time: hierarchical.time,
            params: hierarchical.params,
            clusters: hierarchical.clusters,
            labels: hierarchical.labels,
            metrics: hierarchical.metrics,
            score: hierarchical.score
        },
        {
            title: "DBSCAN",
            icon: faDrawPolygon,
            plot: (
                <DBSCANPlot
                    headers={headers}
                    source={data}
                    labels={dbscan.labels}
                />
            ),
            time: dbscan.time,
            params: dbscan.params,
            clusters: dbscan.clusters,
            labels: dbscan.labels,
            metrics: dbscan.metrics,
            score: dbscan.score
        },
        {
            title: "Optics",
            icon: faMagnifyingGlass,
            plot: (
                <OpticsPlot
                    headers={headers}
                    source={data}
                    labels={optics.labels}
                />
            ),
            time: optics.time,
            params: optics.params,
            clusters: optics.clusters,
            labels: optics.labels,
            metrics: optics.metrics,
            score: optics.score
        },
        {
            title: "Gaussian Mixture",
            icon: faBellConcierge,
            plot: (
                <GMMPlot
                    headers={headers}
                    source={data}
                    labels={gmm.labels}
                />
            ),
            time: gmm.time,
            params: gmm.params,
            clusters: gmm.clusters,
            labels: gmm.labels,
            metrics: gmm.metrics,
            score: gmm.score
        },
        {
            title: "Spectral Clustering",
            icon: faWaveSquare,
            plot: (
                <SpectralPlot
                    headers={headers}
                    source={data}
                    labels={spectral.labels}
                />
            ),
            time: spectral.time,
            params: spectral.params,
            clusters: spectral.clusters,
            labels: spectral.labels,
            metrics: spectral.metrics,
            score: spectral.score
        }
    ];

    return (
        <section className="w-full text-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {models.map((model) => (
                    <ClusterModel
                        key={model.title}
                        title={model.title}
                        icon={model.icon}
                        metrics={
                            <div className="flex flex-col items-center gap-4">
                                {/* Main metrics */}
                                <div className="flex items-center gap-4">
                                    <Metric
                                        icon={faClock}
                                        label="Time"
                                        value={`${model.time}s`}
                                    />

                                    {model.params && (
                                        <div className="flex items-center gap-4">
                                            {Object.entries(model.params).map(([key, value]) => (
                                                <Metric
                                                    key={key}
                                                    icon={faSliders}
                                                    label={key}
                                                    value={value}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <Metric
                                        icon={faCircleNodes}
                                        label="Clusters"
                                        value={model.clusters}
                                    />

                                    <Metric
                                        icon={faChartLine}
                                        label="score"
                                        value={model.score}
                                    />
                                </div>

                                {/* Clustering metrics */}
                                <div className="flex items-center gap-4">
                                    {Object.entries(model.metrics).map(([key, value]) => (
                                        <Metric
                                            key={key}
                                            icon={faChartSimple}
                                            label={key}
                                            value={value}
                                        />
                                    ))}
                                </div>
                            </div>
                        }     
                    >
                        {model.plot}
                    </ClusterModel>
                ))}
            </div>
        </section>
    );
}