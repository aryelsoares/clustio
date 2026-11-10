// API
import { Result } from "@/types/data";
import { ValidationError } from "@/errors/validation";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/$/, "");

// Insert call
export async function processCSV(file: File): Promise<Result> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${API_URL}/insert`, {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        throw new ValidationError("Invalid response", data.error ?? "Failed to process CSV");
    }

    return data;
}

// Inject call
export async function injectCSV(filename: string): Promise<void> {
    const response = await fetch(
        `${API_URL}/inject/${encodeURIComponent(filename)}`
    );

    if (!response.ok) {
        throw new ValidationError("Invalid response", "Failed to export CSV.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename.split(".").slice(0, -1).join(".")}_clustered.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
}

// Reset call
export async function resetCSV(filename: string): Promise<void> {
    const response = await fetch(
        `${API_URL}/reset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ filename })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new ValidationError("Invalid response", data.error || "Failed to delete dataset.");
    }
}