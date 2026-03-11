"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const GIFT_CATALOG = [
  { id: "rose", icon: "🌹", name: "Rosa", coins: 10 },
  { id: "heart", icon: "❤️", name: "Corazón", coins: 20 },
  { id: "star", icon: "⭐", name: "Estrella", coins: 50 },
  { id: "crown", icon: "👑", name: "Corona", coins: 100 },
  { id: "diamond", icon: "💎", name: "Diamante", coins: 200 },
  { id: "rocket", icon: "🚀", name: "Cohete", coins: 500 },
];

export default function GiftsPage() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetch(`${API_URL}/api/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setBalance(d.coins ?? 0); })
      .catch(() => {});
  }, []);

  const sendGift = async (gift) => {
    setError("");
    setSent(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/gifts/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ giftId: gift.id, coins: gift.coins }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "No se pudo enviar el regalo");
        return;
      }
      setSent(gift);
      if (balance !== null) setBalance((b) => b - gift.coins);
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gifts-page">
      <div className="gifts-header">
        <h1 className="gifts-title">🎁 Regalos</h1>
        <p className="gifts-sub">
          Envía regalos virtuales a tus streamers favoritos durante los directos
        </p>
        {balance !== null && (
          <div className="balance-badge">💰 {balance} monedas</div>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}
      {sent && (
        <div className="success-banner">
          ¡Enviaste {sent.icon} {sent.name} ({sent.coins} monedas)!
        </div>
      )}

      <div className="gifts-grid">
        {GIFT_CATALOG.map((gift) => (
          <div key={gift.id} className="gift-card card">
            <span className="gift-icon">{gift.icon}</span>
            <div className="gift-name">{gift.name}</div>
            <div className="gift-cost">🪙 {gift.coins}</div>
            <button
              className="btn btn-primary btn-block"
              onClick={() => sendGift(gift)}
              disabled={loading || (balance !== null && balance < gift.coins)}
            >
              Enviar
            </button>
          </div>
        ))}
      </div>

      <div className="gifts-info card">
        <h3 className="info-title">¿Cómo funcionan los regalos?</h3>
        <ul className="info-list">
          <li>Necesitas tener monedas en tu saldo.</li>
          <li>Cada regalo tiene un coste en monedas.</li>
          <li>Los regalos aparecen animados en el directo del streamer.</li>
          <li>El streamer recibe una notificación y gana puntos de popularidad.</li>
        </ul>
        <Link href="/coins" className="btn btn-secondary" style={{ display: "inline-block", marginTop: "1rem" }}>
          💰 Comprar monedas
        </Link>
      </div>

      <p className="back-link">
        <Link href="/dashboard">← Volver al dashboard</Link>
      </p>

      <style jsx>{`
        .gifts-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .gifts-header { text-align: center; }
        .gifts-title { font-size: 2rem; font-weight: 800; color: var(--text); }
        .gifts-sub { color: var(--text-muted); margin-top: 0.5rem; }

        .balance-badge {
          display: inline-block;
          margin-top: 0.75rem;
          background: var(--accent-dim);
          color: var(--accent);
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.3rem 1rem;
          border-radius: 20px;
          border: 1px solid var(--accent);
        }

        .error-banner {
          background: rgba(244,67,54,0.1);
          border: 1px solid var(--error);
          color: var(--error);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
        }

        .success-banner {
          background: rgba(76,175,80,0.1);
          border: 1px solid var(--success);
          color: var(--success);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          text-align: center;
        }

        .gifts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 1rem;
        }

        .gift-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          padding: 1.5rem 1rem;
          text-align: center;
          transition: transform var(--transition);
        }

        .gift-card:hover { transform: translateY(-3px); }

        .gift-icon { font-size: 2.5rem; }

        .gift-name {
          font-weight: 700;
          color: var(--text);
          font-size: 0.9rem;
        }

        .gift-cost {
          font-size: 0.85rem;
          color: var(--accent);
          font-weight: 600;
        }

        .gifts-info {
          padding: 1.75rem;
        }

        .info-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 1rem;
        }

        .info-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-list li {
          color: var(--text-muted);
          font-size: 0.875rem;
          padding-left: 1.2rem;
          position: relative;
        }

        .info-list li::before {
          content: "•";
          color: var(--accent);
          position: absolute;
          left: 0;
        }

        .back-link { text-align: center; }

        @media (max-width: 480px) {
          .gifts-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
