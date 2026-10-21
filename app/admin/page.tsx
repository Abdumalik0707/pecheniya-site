"use client";

import { useState, useEffect, useCallback } from "react";

interface ProductData {
  _id: string;
  name: string;
  brand: string;
  categoryLabel: string;
  price: number;
  weight: string;
  netWeight: string;
  image: string;
  images: string[];
  description: string;
  descriptionFull: string;
  tags: string[];
  isNew: boolean;
  isPremium: boolean;
}

const EMPTY_FORM = {
  name: "",
  brand: "SmaG",
  categoryLabel: "",
  price: "",
  weight: "",
  netWeight: "",
  image: "",
  description: "",
  descriptionFull: "",
  tags: "",
  isNew: false,
  isPremium: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(p: ProductData) {
    setEditingId(p._id);
    setForm({
      name: p.name,
      brand: p.brand || "SmaG",
      categoryLabel: p.categoryLabel,
      price: String(p.price),
      weight: p.weight,
      netWeight: p.netWeight || "",
      image: p.image,
      description: p.description || "",
      descriptionFull: p.descriptionFull || "",
      tags: (p.tags || []).join(", "),
      isNew: p.isNew || false,
      isPremium: p.isPremium || false,
    });
    setShowModal(true);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || "Yuklashda xatolik");
      }
    } catch {
      alert("Yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.image || !form.categoryLabel || !form.weight) {
      alert("Nomi, kategoriyasi, narxi, og'irligi va rasmi majburiy!");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name,
        brand: form.brand,
        category: "pechenye",
        categoryLabel: form.categoryLabel,
        price: Number(form.price),
        weight: form.weight,
        netWeight: form.netWeight,
        unit: "quti",
        image: form.image,
        images: [form.image],
        description: form.description,
        descriptionFull: form.descriptionFull,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isNew: form.isNew,
        isPremium: form.isPremium,
      };

      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        fetchProducts();
      } else {
        alert(data.error || "Xatolik");
      }
    } catch {
      alert("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Haqiqatan o'chirmoqchimisiz?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.error || "Xatolik");
      }
    } catch {
      alert("Xatolik yuz berdi");
    } finally {
      setDeleting(null);
    }
  }

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div style={{ padding: "32px 32px 64px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc", margin: 0 }}>Mahsulotlar</h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Jami: {products.length} ta</p>
        </div>
        <button onClick={openAdd} style={addBtnStyle}>
          + Yangi tovar
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: "#94a3b8", textAlign: "center", padding: 40 }}>Yuklanmoqda...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 16 }}>
            {search ? "Hech narsa topilmadi" : "Mahsulotlar hali yo'q"}
          </p>
          {!search && (
            <button onClick={openAdd} style={{ ...addBtnStyle, fontSize: 14 }}>
              + Birinchi tovarni qo'shing
            </button>
          )}
        </div>
      ) : (
        <div style={{ background: "#1e293b", borderRadius: 12, border: "1px solid #334155", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #334155" }}>
                <th style={thStyle}>Rasm</th>
                <th style={{ ...thStyle, textAlign: "left" }}>Nomi</th>
                <th style={thStyle}>Kategoriya</th>
                <th style={thStyle}>Narxi</th>
                <th style={thStyle}>Og'irligi</th>
                <th style={thStyle}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid #1e293b" }}>
                  <td style={{ ...tdStyle, width: 64 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        overflow: "hidden",
                        background: "#f1f5f9",
                        flexShrink: 0,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "left" }}>
                    <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: 14 }}>{p.name}</div>
                    <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{p.brand}</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={badgeStyle}>{p.categoryLabel}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 14 }}>
                      {Number(p.price).toLocaleString()}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: "#94a3b8", fontSize: 13 }}>{p.weight}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button onClick={() => openEdit(p)} style={editBtnStyle}>
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deleting === p._id}
                        style={deleteBtnStyle}
                      >
                        {deleting === p._id ? "..." : "O'chirish"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 100,
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1e293b",
              borderRadius: 16,
              border: "1px solid #334155",
              width: "100%",
              maxWidth: 560,
              maxHeight: "90vh",
              overflow: "auto",
              padding: 28,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc", marginBottom: 24, margin: "0 0 24px" }}>
              {editingId ? "Tahrirlash" : "Yangi tovar qo'shish"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Rasm */}
              <div>
                <label style={labelStyle}>Rasm *</label>
                {form.image && (
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#f1f5f9",
                      marginBottom: 8,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image}
                      alt="preview"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={fileInputStyle} />
                {uploading && <p style={{ color: "#60a5fa", fontSize: 12, marginTop: 4 }}>Yuklanmoqda...</p>}
                <div style={{ marginTop: 6 }}>
                  <input
                    type="text"
                    placeholder="yoki rasm URL ni kiriting"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Nomi */}
              <div>
                <label style={labelStyle}>Nomi *</label>
                <input
                  type="text"
                  placeholder="Masalan: Кунжут лочира"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Kategoriya */}
              <div>
                <label style={labelStyle}>Kategoriya *</label>
                <input
                  type="text"
                  placeholder="Masalan: Lochira seriyasi"
                  value={form.categoryLabel}
                  onChange={(e) => setForm({ ...form, categoryLabel: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Narxi va og'irlik */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Narxi (so'm) *</label>
                  <input
                    type="number"
                    placeholder="82000"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Quti og'irligi *</label>
                  <input
                    type="text"
                    placeholder="3 kg"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Brend va dona og'irligi */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Brend</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>1 dona og'irligi</label>
                  <input
                    type="text"
                    placeholder="20g"
                    value={form.netWeight}
                    onChange={(e) => setForm({ ...form, netWeight: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Tavsif */}
              <div>
                <label style={labelStyle}>Qisqa tavsif</label>
                <input
                  type="text"
                  placeholder="Qisqa tavsif"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>To'liq tavsif</label>
                <textarea
                  placeholder="Batafsil tavsif"
                  value={form.descriptionFull}
                  onChange={(e) => setForm({ ...form, descriptionFull: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 60 }}
                />
              </div>

              {/* Teglar */}
              <div>
                <label style={labelStyle}>Teglar (vergul bilan)</label>
                <input
                  type="text"
                  placeholder="lochira, kunjut, shokolad"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Checkboxes */}
              <div style={{ display: "flex", gap: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#cbd5e1", fontSize: 14, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                  />
                  Yangi mahsulot
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#cbd5e1", fontSize: 14, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form.isPremium}
                    onChange={(e) => setForm({ ...form, isPremium: e.target.checked })}
                  />
                  Premium
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={cancelBtnStyle}>
                Bekor qilish
              </button>
              <button onClick={handleSave} disabled={saving} style={saveBtnStyle}>
                {saving ? "Saqlanmoqda..." : editingId ? "Saqlash" : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 12,
  fontWeight: 600,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  textAlign: "center",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  textAlign: "center",
  verticalAlign: "middle",
};

const addBtnStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 10,
  border: "none",
  background: "#3b82f6",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};

const searchInputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 360,
  height: 42,
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#f1f5f9",
  padding: "0 14px",
  fontSize: 14,
  outline: "none",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: 6,
  background: "#334155",
  color: "#94a3b8",
  fontSize: 12,
  fontWeight: 600,
};

const editBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #334155",
  background: "transparent",
  color: "#60a5fa",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const deleteBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #7f1d1d",
  background: "transparent",
  color: "#f87171",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#94a3b8",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#f1f5f9",
  padding: "0 12px",
  fontSize: 14,
  outline: "none",
};

const fileInputStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#94a3b8",
};

const cancelBtnStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "transparent",
  color: "#94a3b8",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

const saveBtnStyle: React.CSSProperties = {
  padding: "10px 24px",
  borderRadius: 8,
  border: "none",
  background: "#3b82f6",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};
