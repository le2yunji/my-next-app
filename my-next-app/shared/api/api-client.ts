import { API_BASE_URL } from "./api";

type RequestOptions = {
  headers?: HeadersInit;
  cache?: RequestCache; // "no-store" 등
  credentials?: RequestCredentials; // 쿠키 포함 여부
  next?: RequestInit["next"];
};

const request = async (
  method: string,
  url: string,
  data?: unknown,
  options?: RequestOptions,
) => {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${url}`, {
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
  } catch {
    // 네트워크 오류 (서버 다운, DNS 실패 등)
    throw new Error("네트워크 오류가 발생했습니다.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = (body as { message?: string }).message ?? res.statusText;
    throw new Error(message);
  }

  return res;
};

const apiClient = {
  get: (url: string, options?: RequestOptions) =>
    request("GET", url, undefined, options),

  post: (url: string, data?: unknown, options?: RequestOptions) =>
    request("POST", url, data, options),

  put: (url: string, data?: unknown, options?: RequestOptions) =>
    request("PUT", url, data, options),

  patch: (url: string, data?: unknown, options?: RequestOptions) =>
    request("PATCH", url, data, options),

  delete: (url: string, options?: RequestOptions) =>
    request("DELETE", url, undefined, options),
};

export default apiClient;
