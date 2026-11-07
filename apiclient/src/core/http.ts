import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import type { CreateHttpOptions, TokenProvider } from './types';

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

export function createHttpClient(opts: CreateHttpOptions): AxiosInstance {
    const { baseURL, getToken, onAuthFailure, defaultHeaders } = opts;
    const http = axios.create({
        baseURL,
        headers: defaultHeaders,
        // You can set withCredentials, timeouts, etc. here if needed
    });

    // Attach token before each request
    if (getToken) {
        http.interceptors.request.use(async (config) => {
            const token = await getToken();
            if (token) {
                if (config.headers) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            }
            return config;
        });
    }

    // Retry once on 401 with a forced token refresh
    http.interceptors.response.use(
        (res) => res,
        async (error: AxiosError) => {
            const res = error.response;
            const cfg = (error.config || {}) as RetriableConfig;

            if (res?.status === 401 && getToken && !cfg._retry) {
                cfg._retry = true;
                try {
                    const newToken = await (getToken as TokenProvider)(true);
                    if (newToken) {
                        cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${newToken}` };
                        return http.request(cfg);
                    }
                } catch (_) {
                    /* fall through */
                }
            }

            if (res?.status === 401 && onAuthFailure) onAuthFailure(error);
            return Promise.reject(error);
        }
    );

    return http;
}
