import { collectDefaultMetrics } from 'prom-client';

export const startMonitoring = async () => {
  collectDefaultMetrics();
};
