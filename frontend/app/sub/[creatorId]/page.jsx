"use client";

import { useState } from "react";

export default function SubscribePage({ params }) {
  const { creatorId } = params;
  const [error, setError] = useState("");

  const subscribe = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/${creatorId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Error al procesar la suscripción");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Suscríbete al creador</h1>
      <p>Accede a lives privados y contenido exclusivo con una suscripción mensual.</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={subscribe} style={{ padding: "0.75rem 2rem", fontSize: "1rem", cursor: "pointer" }}>
        Suscribirse
      </button>
    </div>
  );
}
