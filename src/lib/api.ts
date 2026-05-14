const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010/api";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Produits
  getProduits: () => apiFetch<any[]>("/produits"),
  createProduit: (data: any) => apiFetch("/produits", { method: "POST", body: JSON.stringify(data) }),
  updateProduit: (id: number, data: any) => apiFetch(`/produits/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduit: (id: number) => apiFetch(`/produits/${id}`, { method: "DELETE" }),

  // Machines
  getMachines: () => apiFetch<any[]>("/machines"),
  createMachine: (data: any) => apiFetch("/machines", { method: "POST", body: JSON.stringify(data) }),
  updateMachine: (id: number, data: any) => apiFetch(`/machines/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMachine: (id: number) => apiFetch(`/machines/${id}`, { method: "DELETE" }),

  // Employes
  getEmployes: () => apiFetch<any[]>("/employes"),
  createEmploye: (data: any) => apiFetch("/employes", { method: "POST", body: JSON.stringify(data) }),
  updateEmploye: (id: number, data: any) => apiFetch(`/employes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEmploye: (id: number) => apiFetch(`/employes/${id}`, { method: "DELETE" }),

  // Ordres
  getOrdres: () => apiFetch<any[]>("/ordres"),
  createOrdre: (data: any) => apiFetch("/ordres", { method: "POST", body: JSON.stringify(data) }),
  updateOrdre: (id: number, data: any) => apiFetch(`/ordres/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteOrdre: (id: number) => apiFetch(`/ordres/${id}`, { method: "DELETE" }),
};
