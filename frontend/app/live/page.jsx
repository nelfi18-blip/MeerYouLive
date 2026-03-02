"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LivePage() {
  const [lives, setLives] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lives`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los directos");
        return res.json();
      })
      .then((data) => setLives(data))
      .catch(() => setError("No se pudo cargar la lista de directos"));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>En directo ahora</h1>
      {lives.length === 0 ? (
        <p>No hay directos activos en este momento.</p>
      ) : (
        <ul>
          {lives.map((live) => (
            <li key={live._id}>
              <Link href={`/live/${live._id}`}>
                {live.title} — {live.user?.username ?? "Creador"}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link href="/dashboard">← Volver al panel</Link>
    </div>
  );
}
