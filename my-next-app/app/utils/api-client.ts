import { API_BASE_URL } from "@/app/utils/api";

type RequestOptions = {
  headers?: HeadersInit;
  cache?: RequestCache; // "no-store" 등
  credentials?: RequestCredentials; // 쿠키 포함 여부
  next?: RequestInit["next"];
};

const request = async (
  method: string,
  url: string,
  data?: any,
  options?: RequestOptions
) => {
  return fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    cache: options?.cache,
    credentials: options?.credentials,
    next: options?.next,
  });
};

const apiClient = {
  get: (url: string, options?: RequestOptions) =>
    request("GET", url, undefined, options),

  post: (url: string, data?: any, options?: RequestOptions) =>
    request("POST", url, data, options),

  put: (url: string, data?: any, options?: RequestOptions) =>
    request("PUT", url, data, options),

  delete: (url: string, options?: RequestOptions) =>
    request("DELETE", url, undefined, options),
};

export default apiClient;
