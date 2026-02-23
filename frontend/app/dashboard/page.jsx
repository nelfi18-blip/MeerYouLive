"use client";

import { useEffect, useState } from "react";
import { listLives } from "../../lib/live";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [lives, setLives] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUser(data);
          localStorage.setItem("username", data.username || data.name || "viewer");
        }
      })
      .catch(() => setError("No se pudo cargar el perfil"));

    listLives()
      .then(setLives)
      .catch(() => {});
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 16px" }}>
      <h1>Bienvenido, {user.username}</h1>
      <p>Email: {user.email}</p>

      <div style={{ margin: "24px 0" }}>
        <a
          href="/live/create"
          style={{
            display: "inline-block",
            background: "#e53e3e",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🎥 Ir en vivo
        </a>
      </div>

      <h2>Lives activos 📡</h2>
      {lives.length === 0 ? (
        <p>No hay lives activos ahora mismo.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {lives.map((live) => (
            <li
              key={live._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 10,
              }}
            >
              <strong>{live.title}</strong>{" "}
              <span
                style={{
                  fontSize: 12,
                  background: live.type === "public" ? "#48bb78" : live.type === "private" ? "#e53e3e" : "#805ad5",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: 10,
                  marginLeft: 6,
                }}
              >
                {live.type === "public" ? "Público" : live.type === "private" ? `Privado $${live.price}` : "Suscriptores"}
              </span>
              <br />
              <small>por {live.creator?.username || live.creator?.name}</small>
              <br />
              <a href={`/live/${live._id}`} style={{ color: "#6366f1" }}>
                Ver live →
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
