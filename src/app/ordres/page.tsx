"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const empty = { projet: "", quantite: 1, date: "", etat: "PLANIFIE", produit: null as any };
const etats = ["PLANIFIE", "EN_COURS", "TERMINE", "ANNULE"];

const etatStyle: Record<string, { bg: string; color: string; border: string }> = {
  PLANIFIE:  { bg: "rgba(59,130,246,.15)",  color: "#3b82f6", border: "rgba(59,130,246,.3)" },
  EN_COURS:  { bg: "rgba(234,179,8,.15)",   color: "#eab308", border: "rgba(234,179,8,.3)" },
  TERMINE:   { bg: "rgba(34,197,94,.15)",   color: "#22c55e", border: "rgba(34,197,94,.3)" },
  ANNULE:    { bg: "rgba(239,68,68,.15)",   color: "#ef4444", border: "rgba(239,68,68,.3)" },
};

export default function OrdresPage() {
  const [items, setItems] = useState<any[]>([]);
  const [produits, setProduits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterEtat, setFilterEtat] = useState("ALL");

  const load = () =>
    Promise.all([api.getOrdres(), api.getProduits()])
      .then(([o, p]) => { setItems(o); setProduits(p); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ ...empty }); setEditing(null); setModal(true); };
  const openEdit = (item: any) => {
    setForm({ projet: item.projet, quantite: item.quantite, date: item.date, etat: item.etat, produit: item.produit?.id || "" });
    setEditing(item.id);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, produit: form.produit ? { id: Number(form.produit) } : null };
      if (editing) await api.updateOrdre(editing, payload);
      else await api.createOrdre(payload);
      setModal(false); load();
    } catch { alert("Erreur lors de la sauvegarde"); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer cet ordre ?")) return;
    await api.deleteOrdre(id); load();
  };

  const filtered = filterEtat === "ALL" ? items : items.filter(i => i.etat === filterEtat);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "#f97316" }}>Production</p>
          <h1 className="text-2xl font-semibold" style={{ color: "#f5f5f5", fontFamily: "inherit" }}>Ordres de fabrication</h1>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Nouvel ordre</button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-6">
        {["ALL", ...etats].map(e => {
          const s = etatStyle[e];
          const active = filterEtat === e;
          return (
            <button key={e} onClick={() => setFilterEtat(e)}
              className="px-4 py-2 rounded text-xs font-medium uppercase tracking-wide transition-all"
              style={{
                background: active ? (s ? s.bg : "rgba(249,115,22,.15)") : "transparent",
                color: active ? (s ? s.color : "#f97316") : "#333",
                border: `1px solid ${active ? (s ? s.border : "rgba(249,115,22,.3)") : "#1f1f1f"}`,
                cursor: "pointer",
                fontFamily: "inherit",
              }}>
              {e === "ALL" ? `Tous (${items.length})` : `${e.replace("_", " ")} (${items.filter(i => i.etat === e).length})`}
            </button>
          );
        })}
      </div>

      <div className="card">
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: "#333" }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#333" }}>Aucun ordre trouvé</div>
        ) : (
          <table>
            <thead><tr>
              <th>ID</th><th>Projet</th><th>Produit</th><th>Qté</th><th>Date</th><th>État</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((o: any) => {
                const s = etatStyle[o.etat] || { bg: "#222", color: "#666", border: "#333" };
                return (
                  <tr key={o.id}>
                    <td style={{ color: "#333", fontFamily: "monospace" }}>#{o.id}</td>
                    <td style={{ color: "#f5f5f5", fontWeight: 500 }}>{o.projet}</td>
                    <td>{o.produit?.nom || <span style={{ color: "#333" }}>—</span>}</td>
                    <td style={{ fontWeight: 500 }}>{o.quantite}</td>
                    <td>{o.date ? new Date(o.date).toLocaleDateString("fr-FR") : "—"}</td>
                    <td>
                      <span className="badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                        {o.etat?.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn-edit" onClick={() => openEdit(o)}>Modifier</button>
                        <button className="btn-danger" onClick={() => remove(o.id)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <h2 className="text-base font-medium mb-6" style={{ color: "#f5f5f5" }}>
              {editing ? "Modifier l'ordre" : "Nouvel ordre de fabrication"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Projet</label>
                <input value={form.projet} onChange={e => setForm({ ...form, projet: e.target.value })} placeholder="Nom du projet" />
              </div>
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Produit</label>
                <select value={form.produit || ""} onChange={e => setForm({ ...form, produit: e.target.value })}>
                  <option value="">Sélectionner un produit</option>
                  {produits.map((p: any) => <option key={p.id} value={p.id}>{p.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Quantité</label>
                <input type="number" min={1} value={form.quantite} onChange={e => setForm({ ...form, quantite: +e.target.value })} />
              </div>
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>État</label>
                <select value={form.etat} onChange={e => setForm({ ...form, etat: e.target.value })}>
                  {etats.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1" onClick={save} disabled={saving}>
                {saving ? "Sauvegarde..." : editing ? "Mettre à jour" : "Créer"}
              </button>
              <button className="btn-ghost" onClick={() => setModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
