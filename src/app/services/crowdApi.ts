const BASE_URL = 'http://localhost:8000';

export interface LatestMetrics {
  timestamp: string;
  source: string;
  peoplePred: number;
  trackedIDs: number;
  avgDensity: number;
  riskLevel: 'Normal' | 'Busy' | 'Critical';
  activeIncidents: number;
  accuracy: number;
}

export interface HistoryEntry {
  t: string;
  density: number;
  predDensity15: number;
  peoplePred: number;
  trackedIDs: number;
}

export interface Prediction15 {
  forecastHorizon: string;
  predictedDensity: number;
  predictedRisk: 'Normal' | 'Busy' | 'Critical';
}

export interface HealthStatus {
  status: string;
  service: string;
  mode: string;
  lgbm_loaded: boolean;
  tf_loaded: boolean;
}

export interface HeatmapData {
  heatmap: string; // base64 JPEG
}

async function safeFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const crowdApi = {
  getLatest:     () => safeFetch<LatestMetrics>(`${BASE_URL}/api/v1/metrics/latest`),
  getHistory:    () => safeFetch<HistoryEntry[]>(`${BASE_URL}/api/v1/metrics/history`),
  getPrediction: () => safeFetch<Prediction15>(`${BASE_URL}/api/v1/predictions/15min`),
  getHealth:     () => safeFetch<HealthStatus>(`${BASE_URL}/api/v1/health`),
  getHeatmap:    () => safeFetch<HeatmapData>(`${BASE_URL}/api/v1/heatmap`),
};
