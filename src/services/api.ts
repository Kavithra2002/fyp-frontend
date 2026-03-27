/**
 * API client for the Node.js backend.
 * Set NEXT_PUBLIC_API_URL or default to /api when using Next.js rewrites to the backend.
 */

import type {
  Dataset,
  Model,
  RegisterModelRequest,
  TrainRequest,
  ForecastRequest,
  ForecastResponse,
  ExplainRequest,
  ExplainResponse,
  ScenarioRequest,
  ScenarioResponse,
  ExportRequest,
} from "@/lib/types";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "/api").replace(/\/$/, "");
const AUTH_TOKEN_KEY = "fyp-token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const t = getAuthToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function on401(res: Response): void {
  if (res.status === 401 && typeof window !== "undefined") {
    setAuthToken(null);
    window.location.href = "/login";
  }
}

function parseErrorMessage(raw: string, status: number): string {
  const fallback = raw || `HTTP ${status}`;
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as { error?: string; detail?: string; message?: string };
    if (parsed.error && parsed.detail) return `${parsed.error} (${parsed.detail})`;
    return parsed.error || parsed.message || parsed.detail || fallback;
  } catch {
    return fallback;
  }
}

function url(path: string, params?: Record<string, string>): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const s = BASE + p;
  if (!params || Object.keys(params).length === 0) return s;
  const u = new URL(s, BASE.startsWith("http") ? undefined : "http://_");
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  return BASE.startsWith("http") ? u.toString() : u.pathname + u.search;
}

async function request<T>(
  path: string,
  init?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const { params, ...opts } = init ?? {};
  const res = await fetch(url(path, params), {
    ...opts,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...opts.headers },
  });
  if (!res.ok) {
    on401(res);
    const t = await res.text();
    throw new Error(parseErrorMessage(t, res.status));
  }
  return res.json() as Promise<T>;
}

async function requestBlob(path: string, init?: RequestInit): Promise<Blob> {
  const res = await fetch(url(path), { ...init, headers: { ...authHeaders(), ...init?.headers } });
  if (!res.ok) {
    on401(res);
    throw new Error(parseErrorMessage(await res.text(), res.status));
  }
  return res.blob();
}

// ---- Auth ----
export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  role?: "admin" | "user";
  status?: "active" | "inactive" | string;
};

export const authApi = {
  register: (body: { email: string; password: string; name?: string }) =>
    request<{ user: AppUser; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<{ user: AppUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  me: () => request<{ user: AppUser }>("/auth/me"),
  listUsers: () => request<{ users: AppUser[] }>("/auth/users"),
  createUser: (body: {
    email: string;
    password: string;
    name?: string;
    role?: "admin" | "user";
    status?: "active" | "inactive";
  }) =>
    request<{ user: AppUser }>("/auth/users", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateUser: (
    id: string,
    body: Partial<{
      email: string;
      password: string;
      name: string;
      role: "admin" | "user";
      status: "active" | "inactive";
    }>
  ) =>
    request<{ success: boolean }>("/auth/users/" + id, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};

// ---- Data (UC6) ----
export const dataApi = {
  list: () => request<Dataset[]>("/data"),
  get: (id: string) => request<Dataset>(`/data/${id}`),
  setActive: (id: string) => request<{ ok: boolean }>(`/data/${id}/active`, { method: "PUT" }),
  upload: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(url("/data/upload"), {
      method: "POST",
      headers: authHeaders(),
      body: fd,
    });
    if (!res.ok) {
      on401(res);
      throw new Error(parseErrorMessage(await res.text(), res.status));
    }
    return res.json() as Promise<Dataset>;
  },
};

// ---- Models (UC4) ----
export const modelsApi = {
  list: () => request<Model[]>("/models"),
  get: (id: string) => request<Model>(`/models/${id}`),
  setActive: (id: string) => request<{ ok: boolean }>(`/models/${id}/active`, { method: "PUT" }),
  register: (body: RegisterModelRequest) =>
    request<Model>("/models/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  train: (body: TrainRequest) =>
    request<{ jobId: string; model?: Model }>("/models/train", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  jobStatus: (jobId: string) =>
    request<{ status: "pending" | "running" | "done" | "error"; model?: Model }>(
      `/models/job/${jobId}`
    ),
};

// ---- Forecast (UC1) ----
export const forecastApi = {
  run: (body: ForecastRequest) =>
    request<ForecastResponse>("/forecast", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ---- Explain (UC2) ----
export const explainApi = {
  run: (body: ExplainRequest) =>
    request<ExplainResponse>("/explain", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ---- Scenario (UC3) ----
export const scenarioApi = {
  run: (body: ScenarioRequest) =>
    request<ScenarioResponse>("/scenario", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ---- Export (UC5) ----
export const exportApi = {
  create: async (body: ExportRequest): Promise<Blob> => {
    const res = await fetch(url("/export"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      on401(res);
      throw new Error(parseErrorMessage(await res.text(), res.status));
    }
    return res.blob();
  },
};
