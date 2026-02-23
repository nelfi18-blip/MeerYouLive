"use client";

import { useState } from "react";
import { createLive } from "../../../lib/live";

export default function CreateLivePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("public");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setError("");
    if (!title.trim()) {
      setError("El título es requerido");
      return;
    }
    if (type === "private" && (!price || parseFloat(price) <= 0)) {
      setError("Un live privado requiere un precio mayor a 0");
      return;
    }
    setLoading(true);
    try {
      const live = await createLive({
        title: title.trim(),
        description: description.trim(),
        type,
        price: type === "private" ? parseFloat(price) : 0,
      });
      window.location.href = `/live/${live._id}`;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 16px" }}>
      <h1>Crear Live 🎥</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 12 }}>
        <label>Título</label>
        <br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del live"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Descripción (opcional)</label>
        <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe tu live"
          style={{ width: "100%" }}
          rows={3}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Tipo de live</label>
        <br />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="public">Público — gratis para todos</option>
          <option value="private">Privado — pago único</option>
          <option value="subscribers">Suscriptores — solo con suscripción activa</option>
        </select>
      </div>

      {type === "private" && (
        <div style={{ marginBottom: 12 }}>
          <label>Precio (USD)</label>
          <br />
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="5.00"
          />
        </div>
      )}

      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creando..." : "🚀 Ir en vivo"}
      </button>
    </div>
  );
}
