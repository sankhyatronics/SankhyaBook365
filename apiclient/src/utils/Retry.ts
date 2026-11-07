import { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

/** Compute retry delay. Honors Retry-After (seconds or HTTP-date), else exponential + jitter. */
function nextDelayMs(attempt: number, retryAfter?: string | number) {
  // If server told us exactly when to retry
  if (retryAfter != null) {
    const asNum = Number(retryAfter);
    if (Number.isFinite(asNum)) return clamp(asNum * 1000, 250, 10000); // seconds -> ms
    const dt = Date.parse(String(retryAfter));
    if (!Number.isNaN(dt)) return clamp(dt - Date.now(), 250, 10000);
  }
  // Backoff: 500ms * 2^attempt, with a little jitter, clamped
  const base = (2 ** attempt) * 500;
  const jitter = Math.floor(Math.random() * 250); // 0–250ms
  return clamp(base + jitter, 250, 10000);
}

/** GET with simple retry/backoff for 429/5xx (and 408/network), using the same axios instance (so auth interceptors apply). */
export async function getWithRetry(
  http: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig,
  retries = 3
) {
  let attempt = 0;
  let lastErr: unknown;
  while (attempt <= retries) {
    try {
      return await http.get(url, config);
    } catch (err) {
      lastErr = err;
      const ae = err as AxiosError;
      const status = ae.response?.status;
      const retriable = !status || status === 408 || status === 429 || (status >= 500 && status <= 599);
      if (!retriable) throw err;

      const ra = (ae.response?.headers as any)?.["retry-after"];
      await new Promise(r => setTimeout(r, nextDelayMs(attempt, ra)));
      attempt++;
    }
  }
  throw lastErr;
}

/** POST with simple retry/backoff for 429/5xx (and 408/network). Use with care for non-idempotent operations. */
export async function postWithRetry(
  http: AxiosInstance,
  url: string,
  data: any,
  config?: AxiosRequestConfig,
  retries = 3
) {
  let attempt = 0;
  let lastErr: unknown;
  while (attempt <= retries) {
    try {
      return await http.post(url, data, config);
    } catch (err) {
      lastErr = err;
      const ae = err as AxiosError;
      const status = ae.response?.status;
      const retriable = !status || status === 408 || status === 429 || (status >= 500 && status <= 599);
      if (!retriable) throw err;

      const ra = (ae.response?.headers as any)?.["retry-after"];
      await new Promise(r => setTimeout(r, nextDelayMs(attempt, ra)));
      attempt++;
    }
  }
  throw lastErr;
}

/** PATCH with simple retry/backoff for 429/5xx (and 408/network). */
export async function patchWithRetry(
  http: AxiosInstance,
  url: string,
  data: any,
  config?: AxiosRequestConfig,
  retries = 3
) {
  let attempt = 0;
  let lastErr: unknown;
  while (attempt <= retries) {
    try {
      return await http.patch(url, data, config);
    } catch (err) {
      lastErr = err;
      const ae = err as AxiosError;
      const status = ae.response?.status ?? 0;
      const retriable = !status || status === 408 || status === 429 || (status >= 500 && status <= 599);
      if (!retriable) throw err;

      const ra = (ae.response?.headers as any)?.["retry-after"];
      await new Promise(r => setTimeout(r, nextDelayMs(attempt, ra)));
      attempt++;
    }
  }
  throw lastErr;
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
