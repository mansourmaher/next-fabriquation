"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const empty = { nom: "", poste: "", machineAssignee: null as any };

export default function EmployesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    Promise.all([api.getEmployes(), api.getMachines()])
      .then(([e, m]) => { setItems(e); setMachines(m); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ ...empty }); setEditing(null); setModal(true); };
  const openEdit = (item: any) => {
    setForm({ nom: item.nom, poste: item.poste, machineAssignee: item.machineAssignee?.id || "" });
    setEditing(item.id);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        nom: form.nom,
        poste: form.poste,
        machineAssignee: form.machineAssignee ? { id: Number(form.machineAssignee) } : null,
      };
      if (editing) await api.updateEmploye(editing, payload);
      else await api.createEmploye(payload);
      setModal(false); load();
    } catch { alert("Erreur lors de la sauvegarde"); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer cet employé ?")) return;
    await api.deleteEmploye(id); load();
  };

  const initials = (nom: string) => nom.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ec4899", "#eab308"];
  const avatarColor = (id: number) => colors[id % colors.length];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "#a855f7" }}>Ressources humaines</p>
          <h1 className="text-2xl font-semibold" style={{ color: "#f5f5f5", fontFamily: "inherit" }}>Employés</h1>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Nouvel employé</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: "#333" }}>Chargement...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#333" }}>Aucun employé enregistré</div>
        ) : (
          <table>
            <thead><tr>
              <th>Employé</th><th>Poste</th><th>Machine assignée</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {items.map((e: any) => (
                <tr key={e.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: `${avatarColor(e.id)}22`,
                        border: `1px solid ${avatarColor(e.id)}44`,
                        color: avatarColor(e.id),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 600, flexShrink: 0,
                      }}>{initials(e.nom)}</div>
                      <span style={{ color: "#f5f5f5" }}>{e.nom}</span>
                    </div>
                  </td>
                  <td>{e.poste}</td>
                  <td>
                    {e.machineAssignee ? (
                      <span className="badge" style={{ background: "rgba(34,197,94,.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,.2)" }}>
                        {e.machineAssignee.nom}
                      </span>
                    ) : <span style={{ color: "#333" }}>—</span>}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-edit" onClick={() => openEdit(e)}>Modifier</button>
                      <button className="btn-danger" onClick={() => remove(e.id)}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <h2 className="text-base font-medium mb-6" style={{ color: "#f5f5f5" }}>
              {editing ? "Modifier l'employé" : "Nouvel employé"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Nom complet</label>
                <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Prénom Nom" />
              </div>
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Poste</label>
                <input value={form.poste} onChange={e => setForm({ ...form, poste: e.target.value })} placeholder="Technicien, Opérateur..." />
              </div>
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Machine assignée</label>
                <select value={form.machineAssignee || ""} onChange={e => setForm({ ...form, machineAssignee: e.target.value })}>
                  <option value="">Aucune machine</option>
                  {machines.map((m: any) => <option key={m.id} value={m.id}>{m.nom}</option>)}
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
