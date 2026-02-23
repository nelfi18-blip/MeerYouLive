"use client";

import { useState } from "react";

const GIFT_PRICES = [
  { label: "$3", amount: 3, emoji: "🎁" },
  { label: "$5", amount: 5, emoji: "💝" },
  { label: "$10", amount: 10, emoji: "🌟" },
];

const GIFT_PACKS = [
  { label: "5 regalos", count: 5, emoji: "🎀" },
  { label: "10 regalos", count: 10, emoji: "🎊" },
  { label: "20 regalos", count: 20, emoji: "🏆" },
];

const DEFAULT_GIFT_AMOUNT = GIFT_PRICES[0].amount;

export default function GiftsPage() {
  const [selected, setSelected] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null);
  const [creatorId, setCreatorId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendGift = async () => {
    if (!creatorId) {
      setStatus("Por favor, indica el ID del creador.");
      return;
    }
    const amount = selectedPack
      ? selectedPack.count * (selected ? selected.amount : DEFAULT_GIFT_AMOUNT)
      : selected?.amount;
    if (!amount) {
      setStatus("Selecciona un precio o paquete de regalos.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login?redirect=/gifts";
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gifts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipientId: creatorId, amount }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.message || "Error al enviar el regalo");
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        setStatus("¡Regalo enviado! 💙 Apoyaste directamente al creador.");
      }
    } catch {
      setStatus("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", textAlign: "center" }}>🎁 Enviar regalos</h1>
      <p style={{ textAlign: "center", color: "#555", marginBottom: "2rem" }}>
        Apoya directamente a tus creadores favoritos
      </p>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Elige un precio</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {GIFT_PRICES.map((p) => (
            <button
              key={p.amount}
              onClick={() => setSelected(p)}
              style={{
                flex: 1,
                minWidth: "80px",
                padding: "1rem",
                borderRadius: "10px",
                border: selected?.amount === p.amount ? "2px solid #1d9bf0" : "2px solid #e0e0e0",
                background: selected?.amount === p.amount ? "#e8f4fd" : "#fff",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>O elige un paquete</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {GIFT_PACKS.map((pk) => (
            <button
              key={pk.count}
              onClick={() => setSelectedPack(pk)}
              style={{
                flex: 1,
                minWidth: "100px",
                padding: "1rem",
                borderRadius: "10px",
                border: selectedPack?.count === pk.count ? "2px solid #1d9bf0" : "2px solid #e0e0e0",
                background: selectedPack?.count === pk.count ? "#e8f4fd" : "#fff",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              {pk.emoji} {pk.label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>ID del creador</h2>
        <input
          type="text"
          placeholder="ID del creador que quieres apoyar"
          value={creatorId}
          onChange={(e) => setCreatorId(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "1rem",
            boxSizing: "border-box",
          }}
        />
      </section>

      <button
        onClick={handleSendGift}
        disabled={loading}
        style={{
          width: "100%",
          background: "#1d9bf0",
          color: "#fff",
          border: "none",
          padding: "1rem",
          borderRadius: "8px",
          fontSize: "1.1rem",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Enviando…" : "💙 Enviar regalo"}
      </button>

      {status && (
        <p
          style={{
            marginTop: "1rem",
            textAlign: "center",
            color: status.startsWith("¡") ? "#1d9bf0" : "red",
            fontWeight: "bold",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}
