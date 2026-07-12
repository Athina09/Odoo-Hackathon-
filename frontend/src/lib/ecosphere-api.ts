/** EcoSphere API client — proxied to backend :8000 via Vite in dev */

export interface MobileBootstrap {
  employeeId: string;
  xp: number;
  points: number;
  rank: number;
  badges: string[];
  challenges: Array<{
    id: string;
    title: string;
    progress: number;
    progressTarget: number;
    xpReward: number;
    status: string;
  }>;
  csrActivities: Array<{
    id: string;
    title: string;
    date: string;
    points: number;
    status: string;
  }>;
  notifications: Array<{ id: string; text: string; read: boolean }>;
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    await apiFetch<{ status: string }>("/api/health");
    return true;
  } catch {
    return false;
  }
}

export async function fetchEsgKpis() {
  return apiFetch<Record<string, number>>("/api/esg/kpis");
}

export async function fetchMobileBootstrap(employeeId: string): Promise<MobileBootstrap> {
  return apiFetch<MobileBootstrap>(`/api/mobile/bootstrap/${employeeId}`);
}

export async function searchEsgInsights(query: string, module?: string) {
  const params = new URLSearchParams({ query });
  if (module) params.set("module", module);
  return apiFetch<{ results: Array<{ document: string; metadata: Record<string, string> }> }>(
    `/api/rag/search?${params}`,
  );
}

/** Merge API bootstrap into local employee gamification state when backend is up. */
export async function initializeMobileFromApi(employeeId: string): Promise<MobileBootstrap | null> {
  try {
    return await fetchMobileBootstrap(employeeId);
  } catch {
    return null;
  }
}
