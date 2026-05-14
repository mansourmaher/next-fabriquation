"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const empty = { nom: "", etat: "OPERATIONNELLE", derniereMaintenance: "" };
const etats = ["OPERATIONNELLE", "MAINTENANCE", "HORS_SERVICE"];

const etatStyle: Record<string, { bg: string; color: string; border: string }> = {
  OPERATIONNELLE: { bg: "rgba(34,197,94,.15)", color: "#22c55e", border: "rgba(34,197,94,.3)" },
  MAINTENANCE: { bg: "rgba(234,179,8,.15)", color: "#eab308", border: "rgba(234,179,8,.3)" },
  HORS_SERVICE: { bg: "rgba(239,68,68,.15)", color: "#ef4444", border: "rgba(239,68,68,.3)" },
};

export default function MachinesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.getMachines().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = (item: any) => { setForm({ ...item }); setEditing(item.id); setModal(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await api.updateMachine(editing, form);
      else await api.createMachine(form);
      setModal(false); load();
    } catch { alert("Erreur lors de la sauvegarde"); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer cette machine ?")) return;
    await api.deleteMachine(id); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "#22c55e" }}>Parc machines</p>
          <h1 className="text-2xl font-semibold" style={{ color: "#f5f5f5", fontFamily: "inherit" }}>Machines</h1>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Nouvelle machine</button>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3 mb-6">
        {etats.map(e => {
          const s = etatStyle[e];
          const count = items.filter(i => i.etat === e).length;
          return (
            <div key={e} className="px-4 py-2 rounded text-xs font-medium uppercase tracking-wide"
              style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
              {count} {e.replace("_", " ")}
            </div>
          );
        })}
      </div>

      <div className="card">
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: "#333" }}>Chargement...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#333" }}>Aucune machine enregistrée</div>
        ) : (
          <table>
            <thead><tr>
              <th>ID</th><th>Nom</th><th>État</th><th>Dernière maintenance</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {items.map((m: any) => {
                const s = etatStyle[m.etat] || { bg: "#222", color: "#666", border: "#333" };
                return (
                  <tr key={m.id}>
                    <td style={{ color: "#333", fontFamily: "monospace" }}>#{m.id}</td>
                    <td style={{ color: "#f5f5f5" }}>{m.nom}</td>
                    <td>
                      <span className="badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                        {m.etat?.replace("_", " ")}
                      </span>
                    </td>
                    <td>{m.derniereMaintenance ? new Date(m.derniereMaintenance).toLocaleDateString("fr-FR") : "—"}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn-edit" onClick={() => openEdit(m)}>Modifier</button>
                        <button className="btn-danger" onClick={() => remove(m.id)}>Supprimer</button>
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
              {editing ? "Modifier la machine" : "Nouvelle machine"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Nom</label>
                <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Nom de la machine" />
              </div>
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>État</label>
                <select value={form.etat} onChange={e => setForm({ ...form, etat: e.target.value })}>
                  {etats.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Dernière maintenance</label>
                <input type="date" value={form.derniereMaintenance} onChange={e => setForm({ ...form, derniereMaintenance: e.target.value })} />
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
