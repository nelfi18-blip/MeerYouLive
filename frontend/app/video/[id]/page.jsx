"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Vídeo no encontrado");
        return res.json();
      })
      .then(setVideo)
      .catch((err) => setError(err.message));
  }, [id]);

  const handleUnlock = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = `/login?redirect=/video/${id}`;
      return;
    }
    setPaying(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/checkout/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || "Error al procesar el pago");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setPaying(false);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: video?.title, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("¡Enlace copiado!");
    }
  };

  if (error) return <p style={{ color: "red", padding: "2rem" }}>{error}</p>;
  if (!video) return <p style={{ padding: "2rem" }}>Cargando vídeo…</p>;

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem" }}>{video.title}</h1>
      {video.description && (
        <p style={{ color: "#555", marginBottom: "1rem" }}>{video.description}</p>
      )}

      {video.isPrivate ? (
        <div
          style={{
            position: "relative",
            background: "#000",
            borderRadius: "12px",
            overflow: "hidden",
            aspectRatio: "16/9",
            marginBottom: "1.5rem",
          }}
        >
          {video.teaserUrl ? (
            <video
              src={video.teaserUrl}
              autoPlay
              muted
              loop
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                minHeight: "240px",
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "4rem" }}>🔒</span>
            </div>
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.45)",
            }}
          >
            <p style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "1rem", fontWeight: "bold" }}>
              🔒 Contenido exclusivo
            </p>
            <button
              onClick={handleUnlock}
              disabled={paying}
              style={{
                background: "#1d9bf0",
                color: "#fff",
                border: "none",
                padding: "0.85rem 2rem",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {paying ? "Procesando…" : `Desbloquear por $${video.price}`}
            </button>
          </div>
        </div>
      ) : (
        <video
          src={video.url}
          controls
          style={{ width: "100%", borderRadius: "12px", marginBottom: "1.5rem" }}
        />
      )}

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button
          onClick={handleShare}
          style={{
            background: "#f0f0f0",
            border: "none",
            padding: "0.6rem 1.4rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          🔗 Compartir
        </button>
        <a
          href="/creators"
          style={{
            background: "#f0f0f0",
            padding: "0.6rem 1.4rem",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#333",
            fontSize: "0.95rem",
          }}
        >
          🎥 ¿Eres creador? Únete
        </a>
      </div>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}
