"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LIVE_PROVIDER_KEY = process.env.NEXT_PUBLIC_LIVE_PROVIDER_KEY;

const CATEGORIES = ["Gaming", "Música", "Charla", "Arte", "Educación", "Otro"];

export default function StartLivePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Charla");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [live, setLive] = useState(null);
  const [ending, setEnding] = useState(false);

  const startLive = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch(`${API_URL}/api/lives/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), category }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Error al iniciar el directo");
        return;
      }
      setLive(data);
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const endLive = async () => {
    if (!live) return;
    setEnding(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/lives/${live._id}/end`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/live");
    } catch {
      setEnding(false);
    }
  };

  if (live) {
    const pushUrl = LIVE_PROVIDER_KEY
      ? `rtmp://live.cinectar.com/live/${LIVE_PROVIDER_KEY}/${live.streamKey}`
      : null;

    return (
      <div className="start-page">
        <div className="live-active card">
          <div className="live-active-header">
            <span className="badge badge-live">🔴 EN VIVO</span>
            <h1 className="live-title-text">{live.title}</h1>
          </div>

          <div className="stream-info">
            <h2 className="info-heading">Configuración de streaming</h2>
            <p className="info-hint">
              Usa estas credenciales en OBS Studio u otro software de streaming para empezar a transmitir.
            </p>

            <div className="credential-row">
              <span className="cred-label">Stream Key</span>
              <code className="cred-value">{live.streamKey}</code>
            </div>

            {pushUrl && (
              <div className="credential-row">
                <span className="cred-label">URL del servidor</span>
                <code className="cred-value">{pushUrl}</code>
              </div>
            )}
          </div>

          <div className="live-actions">
            <Link href={`/live/${live._id}`} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              👁 Ver mi directo
            </Link>
            <button
              className="btn btn-danger"
              onClick={endLive}
              disabled={ending}
            >
              {ending ? "Terminando…" : "⏹ Terminar directo"}
            </button>
          </div>
        </div>

        <style jsx>{`
          .start-page { display: flex; flex-direction: column; gap: 1.5rem; max-width: 600px; margin: 0 auto; }

          .live-active { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }

          .live-active-header { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }

          .live-title-text { font-size: 1.4rem; font-weight: 800; color: var(--text); }

          .stream-info { display: flex; flex-direction: column; gap: 0.875rem; }

          .info-heading { font-size: 1rem; font-weight: 700; color: var(--text); }

          .info-hint { font-size: 0.85rem; color: var(--text-muted); }

          .credential-row {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            background: var(--card-hover);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            padding: 0.75rem 1rem;
          }

          .cred-label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }

          .cred-value {
            font-family: monospace;
            font-size: 0.85rem;
            color: var(--accent);
            word-break: break-all;
          }

          .live-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

          .btn-danger {
            background: var(--error);
            color: #fff;
            border: none;
            padding: 0.6rem 1.25rem;
            border-radius: var(--radius-sm);
            font-weight: 600;
            cursor: pointer;
            font-size: 0.9rem;
            transition: opacity 0.2s;
          }
          .btn-danger:hover:not(:disabled) { opacity: 0.85; }
          .btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="start-page">
      <div className="start-header">
        <h1 className="start-title">🔴 Iniciar directo</h1>
        <p className="start-sub">Configura tu transmisión y comienza a hacer streaming</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form className="start-card card" onSubmit={startLive}>
        <div className="form-group">
          <label className="form-label">Título del directo *</label>
          <input
            className="input"
            type="text"
            placeholder="¿De qué va tu directo?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            className="input desc-input"
            placeholder="Describe tu directo (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Categoría</label>
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="start-actions">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? "Iniciando…" : "🔴 Iniciar directo"}
          </button>
          <Link href="/live" className="btn btn-secondary btn-lg">
            Cancelar
          </Link>
        </div>
      </form>

      <div className="tips card">
        <h3 className="tips-title">💡 Consejos antes de empezar</h3>
        <ul className="tips-list">
          <li>Asegúrate de tener buena iluminación y micrófono</li>
          <li>Comprueba tu conexión a internet (mínimo 5 Mbps de subida)</li>
          <li>Usa OBS Studio o StreamLabs para la transmisión</li>
          <li>Anuncia tu directo con antelación para atraer más espectadores</li>
        </ul>
      </div>

      <style jsx>{`
        .start-page { display: flex; flex-direction: column; gap: 1.5rem; max-width: 600px; margin: 0 auto; }

        .start-title { font-size: 1.75rem; font-weight: 800; color: var(--text); }
        .start-sub { color: var(--text-muted); margin-top: 0.3rem; }

        .start-card { padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; }

        .form-group { display: flex; flex-direction: column; gap: 0.45rem; }

        .form-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .desc-input { resize: vertical; min-height: 80px; }

        .start-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; }

        /* Tips */
        .tips { padding: 1.5rem; }
        .tips-title { font-size: 0.95rem; font-weight: 700; color: var(--text); margin-bottom: 0.875rem; }
        .tips-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-left: 1.25rem;
          color: var(--text-muted);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        /* Error */
        .error-banner {
          background: rgba(244,67,54,0.1);
          border: 1px solid var(--error);
          color: var(--error);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
