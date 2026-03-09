"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API_URL}/api/user/me`, { headers })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return null;
        }
        return res.json();
      })
      .then((data) => { if (data) setUser(data); })
      .catch(() => setError("No se pudo cargar el perfil. Por favor, intenta de nuevo o vuelve a iniciar sesión."));

    fetch(`${API_URL}/api/user/coins`, { headers })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data) setCoins(data); })
      .catch(() => {});
  }, [session, status]);

  if (error) {
    return (
      <div className="state-center">
        <p>⚠️ {error}</p>
        <Link href="/login" className="btn btn-primary">Volver al inicio</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="state-center">
        <div className="spinner" />
        <p>Cargando…</p>
      </div>
    );
  }

  const displayName = user.username || user.name || "Usuario";
  const initial = displayName[0].toUpperCase();

  return (
    <div className="profile">
      <h1 className="page-title">Mi Perfil</h1>

      <div className="profile-card card">
        <div className="profile-avatar">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={displayName}
              width={96}
              height={96}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div className="avatar-placeholder" style={{ width: 96, height: 96, fontSize: "2rem" }}>
              {initial}
            </div>
          )}
        </div>
        <div className="profile-info">
          <div className="profile-name">{displayName}</div>
          <div className="profile-email">{user.email}</div>
          {user.role && (
            <span className="badge">{user.role}</span>
          )}
        </div>
      </div>

      {coins !== null && (
        <div className="stats-row">
          <div className="stat-card card">
            <span className="stat-icon">💰</span>
            <div>
              <div className="stat-value">{coins.coins ?? 0}</div>
              <div className="stat-label">Monedas</div>
            </div>
          </div>
          <div className="stat-card card">
            <span className="stat-icon">🎁</span>
            <div>
              <div className="stat-value">{coins.earningsCoins ?? 0}</div>
              <div className="stat-label">Ganancias</div>
            </div>
          </div>
        </div>
      )}

      <div className="profile-actions">
        <Link href="/coins" className="btn btn-primary">💰 Comprar monedas</Link>
        <Link href="/dashboard" className="btn btn-secondary">🏠 Ir al inicio</Link>
      </div>

      <style jsx>{`
        .profile {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text);
        }

        .profile-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
        }

        .profile-info { display: flex; flex-direction: column; gap: 0.4rem; }

        .profile-name {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text);
        }

        .profile-email { color: var(--text-muted); font-size: 0.9rem; }

        .stats-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 1.5rem;
          flex: 1;
          min-width: 140px;
        }

        .stat-icon { font-size: 1.5rem; }

        .stat-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.2rem;
        }

        .profile-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

        .state-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1rem;
          color: var(--text-muted);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

