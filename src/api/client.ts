// API client configuration
export interface ApiErrorShape {
  message: string;
  status?: number;
  details?: unknown;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorBody: any = null;
    try {
      errorBody = await res.json();
    } catch {
      // ignore
    }
    const error: ApiErrorShape = {
      message: errorBody?.message ?? res.statusText,
      status: res.status,
      details: errorBody,
    };
    throw error;
  }
  // 204 No Content is valid
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
  });
  return handleResponse<T>(res);
}

export async function apiPost<T, B = unknown>(
  path: string,
  body?: B,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });
  return handleResponse<T>(res);
}

export async function apiPatch<T, B = unknown>(
  path: string,
  body?: B,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });
  return handleResponse<T>(res);
}

export async function apiDelete<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    credentials: 'include',
    ...init,
  });
  return handleResponse<T>(res);
}

