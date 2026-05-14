"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const empty = { nom: "", type: "", stock: 0, fournisseur: "" };

export default function ProduitsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.getProduits().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = (item: any) => { setForm({ ...item }); setEditing(item.id); setModal(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await api.updateProduit(editing, form);
      else await api.createProduit(form);
      setModal(false); load();
    } catch (e) { alert("Erreur lors de la sauvegarde"); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await api.deleteProduit(id); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "#3b82f6" }}>Inventaire</p>
          <h1 className="text-2xl font-semibold" style={{ color: "#f5f5f5", fontFamily: "inherit" }}>Produits</h1>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Nouveau produit</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: "#333" }}>Chargement...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#333" }}>Aucun produit enregistré</div>
        ) : (
          <table>
            <thead><tr>
              <th>ID</th><th>Nom</th><th>Type</th><th>Stock</th><th>Fournisseur</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {items.map((p: any) => (
                <tr key={p.id}>
                  <td style={{ color: "#333", fontFamily: "monospace" }}>#{p.id}</td>
                  <td style={{ color: "#f5f5f5" }}>{p.nom}</td>
                  <td>{p.type}</td>
                  <td>
                    <span style={{
                      color: p.stock < 10 ? "#ef4444" : p.stock < 50 ? "#eab308" : "#22c55e",
                      fontWeight: 500
                    }}>{p.stock}</span>
                  </td>
                  <td>{p.fournisseur}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-edit" onClick={() => openEdit(p)}>Modifier</button>
                      <button className="btn-danger" onClick={() => remove(p.id)}>Supprimer</button>
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
              {editing ? "Modifier le produit" : "Nouveau produit"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Nom</label>
                <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Nom du produit" />
              </div>
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Type</label>
                <input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="Type / catégorie" />
              </div>
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Stock</label>
                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="block text-xs mb-1.5 tracking-wide uppercase" style={{ color: "#525252" }}>Fournisseur</label>
                <input value={form.fournisseur} onChange={e => setForm({ ...form, fournisseur: e.target.value })} placeholder="Nom du fournisseur" />
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
