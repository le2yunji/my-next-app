// axios 스타일 객체 형식

import { API_BASE_URL } from "@/app/utils/api";

type RequestOptions = {
  headers?: HeadersInit;
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
