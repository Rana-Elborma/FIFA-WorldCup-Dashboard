import { useState, useEffect, useRef } from 'react';
import { crowdApi, LatestMetrics, Prediction15, HealthStatus } from '../services/crowdApi';

const POLL_MS = 4000; // poll every 4 seconds

interface CrowdState {
  latest:     LatestMetrics | null;
  prediction: Prediction15  | null;
  health:     HealthStatus  | null;
  connected:  boolean;
}

export function useCrowdMetrics(): CrowdState {
  const [state, setState] = useState<CrowdState>({
    latest:    null,
    prediction: null,
    health:    null,
    connected: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = async () => {
    const [latest, prediction, health] = await Promise.all([
      crowdApi.getLatest(),
      crowdApi.getPrediction(),
      crowdApi.getHealth(),
    ]);

    setState({
      latest,
      prediction,
      health,
      connected: latest !== null,
    });
  };

  useEffect(() => {
    fetchAll();
    timerRef.current = setInterval(fetchAll, POLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return state;
}
