"use client";

import { useState, useEffect, useCallback } from "react";

interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerType: "individual" | "shop";
  products: OrderProduct[];
  totalAmount: number;
  status: string;
  notes?: string;
  createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  yangi_mijoz: { label: "Yangi", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  yetkazib_berishda: { label: "Yetkazilmoqda", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  yetkazib_berildi: { label: "Yetkazildi", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  tolov_otkazildi: { label: "Bekor qilindi", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadOrders();
  }

  async function deleteOrder(id: string) {
    if (!confirm("Buyurtmani o'chirmoqchimisiz?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    loadOrders();
  }

  function downloadNakladnoy(id: string) {
    window.open(`/api/orders/${id}/nakladnoy`, "_blank");
  }

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.products.some((p) => p.productName.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = filtered.reduce((s, o) => s + o.totalAmount, 0);

  if (loading) {
    return (
      <div style={{ padding: 40, color: "#94a3b8", textAlign: "center" }}>
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 32px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc", margin: 0 }}>
            Buyurtmalar
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
            Jami: {filtered.length} ta buyurtma &middot; {totalRevenue.toLocaleString()} so'm
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Qidirish (ism, telefon, tovar)..."
          style={{
            flex: 1,
            minWidth: 220,
            height: 42,
            borderRadius: 10,
            border: "1px solid #334155",
            background: "#1e293b",
            padding: "0 14px",
            fontSize: 14,
            color: "#f8fafc",
            outline: "none",
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            height: 42,
            borderRadius: 10,
            border: "1px solid #334155",
            background: "#1e293b",
            padding: "0 14px",
            fontSize: 14,
            color: "#f8fafc",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="all">Barcha status</option>
          <option value="yangi_mijoz">Yangi</option>
          <option value="yetkazib_berishda">Yetkazilmoqda</option>
          <option value="yetkazib_berildi">Yetkazildi</option>
          <option value="tolov_otkazildi">Bekor qilindi</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
          Buyurtma topilmadi
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((order) => {
            const st = STATUS_MAP[order.status] || STATUS_MAP.yangi_mijoz;
            const date = new Date(order.createdAt);
            return (
              <div
                key={order._id}
                style={{
                  background: "#1e293b",
                  borderRadius: 14,
                  border: "1px solid #334155",
                  padding: "20px 24px",
                }}
              >
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc" }}>
                        {order.customerName}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 8,
                          background: st.bg,
                          color: st.color,
                        }}
                      >
                        {st.label}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 8px",
                          borderRadius: 8,
                          background: "rgba(148,163,184,0.1)",
                          color: "#94a3b8",
                        }}
                      >
                        {order.customerType === "shop" ? "Do'kon" : "Jismoniy"}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                      {order.customerPhone} &middot; {date.toLocaleDateString("ru-RU")} {date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    {order.customerAddress && (
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                        {order.customerAddress.slice(0, 80)}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#22d3ee" }}>
                      {order.totalAmount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>so'm</div>
                  </div>
                </div>

                {/* Products */}
                <div
                  style={{
                    background: "#0f172a",
                    borderRadius: 10,
                    padding: "12px 16px",
                    marginBottom: 14,
                  }}
                >
                  {order.products.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        borderBottom: i < order.products.length - 1 ? "1px solid #1e293b" : "none",
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "#cbd5e1" }}>
                        {p.productName} x{p.quantity}
                      </span>
                      <span style={{ color: "#94a3b8", fontWeight: 600 }}>
                        {(p.quantity * p.price).toLocaleString()} so'm
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => downloadNakladnoy(order._id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      background: "#0ea5e9",
                      color: "#fff",
                      border: "none",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Nakladnoy yuklab olish
                  </button>

                  {order.status === "yangi_mijoz" && (
                    <button
                      onClick={() => updateStatus(order._id, "yetkazib_berishda")}
                      style={actionBtn("#f59e0b")}
                    >
                      Yetkazishga berish
                    </button>
                  )}
                  {order.status === "yetkazib_berishda" && (
                    <button
                      onClick={() => updateStatus(order._id, "yetkazib_berildi")}
                      style={actionBtn("#22c55e")}
                    >
                      Yetkazildi
                    </button>
                  )}
                  {order.status !== "tolov_otkazildi" && order.status !== "yetkazib_berildi" && (
                    <button
                      onClick={() => updateStatus(order._id, "tolov_otkazildi")}
                      style={actionBtn("#ef4444")}
                    >
                      Bekor qilish
                    </button>
                  )}

                  <button
                    onClick={() => deleteOrder(order._id)}
                    style={{
                      marginLeft: "auto",
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: "transparent",
                      border: "1px solid #334155",
                      color: "#64748b",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function actionBtn(color: string): React.CSSProperties {
  return {
    padding: "8px 16px",
    borderRadius: 8,
    background: "transparent",
    border: `1px solid ${color}`,
    color,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  };
}
