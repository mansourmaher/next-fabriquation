"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ ordres: 0, produits: 0, machines: 0, employes: 0 });
  const [ordres, setOrdres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getOrdres(), api.getProduits(), api.getMachines(), api.getEmployes()])
      .then(([o, p, m, e]) => {
        setStats({ ordres: o.length, produits: p.length, machines: m.length, employes: e.length });
        setOrdres(o.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Ordres", value: stats.ordres, icon: "◈", color: "#f97316" },
    { label: "Produits", value: stats.produits, icon: "◻", color: "#3b82f6" },
    { label: "Machines", value: stats.machines, icon: "◎", color: "#22c55e" },
    { label: "Employés", value: stats.employes, icon: "◉", color: "#a855f7" },
  ];

  const etatColor: Record<string, string> = {
    "EN_COURS": "#eab308", "TERMINE": "#22c55e", "ANNULE": "#ef4444", "PLANIFIE": "#3b82f6"
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "#f97316" }}>Tableau de bord</p>
        <h1 className="text-2xl font-semibold" style={{ color: "#f5f5f5", fontFamily: "inherit" }}>
          Vue d'ensemble
        </h1>
        <p className="text-sm mt-1" style={{ color: "#525252" }}>
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs tracking-widest uppercase" style={{ color: "#333" }}>{label}</span>
              <span style={{ color, fontSize: 18 }}>{icon}</span>
            </div>
            <p className="text-3xl font-semibold" style={{ color: "#f5f5f5", fontFamily: "inherit" }}>
              {loading ? "—" : value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Ordres */}
      <div className="card">
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "#2a2a2a" }}>
          <p className="text-sm font-medium" style={{ color: "#a3a3a3" }}>Ordres récents</p>
          <a href="/ordres" className="text-xs" style={{ color: "#f97316", textDecoration: "none" }}>Voir tout →</a>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: "#333" }}>Chargement...</div>
        ) : ordres.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#333" }}>Aucun ordre de fabrication</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Projet</th><th>Produit</th><th>Qté</th><th>Date</th><th>État</th>
              </tr>
            </thead>
            <tbody>
              {ordres.map((o: any) => (
                <tr key={o.id}>
                  <td style={{ color: "#333", fontFamily: "monospace" }}>#{o.id}</td>
                  <td style={{ color: "#f5f5f5" }}>{o.projet}</td>
                  <td>{o.produit?.nom || "—"}</td>
                  <td>{o.quantite}</td>
                  <td>{o.date ? new Date(o.date).toLocaleDateString("fr-FR") : "—"}</td>
                  <td>
                    <span className="badge" style={{
                      background: `${etatColor[o.etat] || "#666"}22`,
                      color: etatColor[o.etat] || "#666",
                      border: `1px solid ${etatColor[o.etat] || "#666"}44`,
                    }}>{o.etat}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
