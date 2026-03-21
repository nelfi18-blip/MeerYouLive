"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${API_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Error al cargar perfil");
        return r.json();
      })
      .then((d) => {
        setUser(d);
        setEditName(d.name || "");
        setEditUsername(d.username || "");
        setEditBio(d.bio || "");
      })
      .catch(() => setError("No se pudo cargar el perfil"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    signOut({ callbackUrl: "/login" });
  };

  const handleSave = async () => {
    setSaveError("");
    setSaveSuccess("");
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/user/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, username: editUsername, bio: editBio }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.message || "Error al guardar");
        return;
      }
      setUser(data);
      setSaveSuccess("Perfil actualizado correctamente");
      setEditing(false);
    } catch {
      setSaveError("No se pudo conectar con el servidor");
    } finally {
      setSaving(false);
    }
  };

  const displayName = user?.username || user?.name || session?.user?.name || "Usuario";
  const initial = displayName[0].toUpperCase();

  return (
    <div className="profile-page">
      {loading && (
        <div className="skeleton-wrap">
          <div className="skeleton-avatar" />
          <div className="skeleton-line" style={{ width: "160px" }} />
          <div className="skeleton-line" style={{ width: "120px" }} />
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {!loading && user && (
        <>
          <div className="profile-card card">
            <div className="profile-avatar avatar-placeholder">{initial}</div>
            <div className="profile-info">
              <h1 className="profile-name">{displayName}</h1>
              {user.username && <p className="profile-handle">@{user.username}</p>}
              <p className="profile-email">{user.email}</p>
              {user.bio && <p className="profile-bio">{user.bio}</p>}
              <span className={`profile-role badge ${user.role === "creator" ? "badge-accent" : "badge-muted"}`}>
                {user.role === "creator" ? "🎥 Creador" : user.role === "admin" ? "🛡 Admin" : "👤 Usuario"}
              </span>
            </div>
            <button
              className="btn btn-secondary edit-btn"
              onClick={() => { setEditing(!editing); setSaveError(""); setSaveSuccess(""); }}
            >
              {editing ? "✕ Cancelar" : "✏️ Editar"}
            </button>
          </div>

          {editing && (
            <div className="edit-card card">
              <h2 className="edit-title">Editar perfil</h2>
              {saveError && <div className="error-banner">{saveError}</div>}
              {saveSuccess && <div className="success-banner">{saveSuccess}</div>}
              <div className="edit-form">
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input
                    className="input"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Tu nombre"
                    maxLength={60}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre de usuario</label>
                  <input
                    className="input"
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="tunombredeusuario"
                    maxLength={30}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    className="input bio-input"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Cuéntanos algo sobre ti…"
                    maxLength={200}
                    rows={3}
                  />
                  <span className="char-count">{editBio.length}/200</span>
                </div>
                <button
                  className="btn btn-primary btn-block"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </div>
          )}

          <div className="stats-row">
            <div className="stat-card card">
              <span className="stat-icon">💰</span>
              <div className="stat-value">{user.coins ?? 0}</div>
              <div className="stat-label">Monedas</div>
            </div>
            {user.role === "creator" && (
              <div className="stat-card card">
                <span className="stat-icon">🏆</span>
                <div className="stat-value">{user.earningsCoins ?? 0}</div>
                <div className="stat-label">Ganancias</div>
              </div>
            )}
            <div className="stat-card card">
              <span className="stat-icon">📅</span>
              <div className="stat-value">
                {new Date(user.createdAt).toLocaleDateString("es-ES", { month: "short", year: "numeric" })}
              </div>
              <div className="stat-label">Miembro desde</div>
            </div>
          </div>

          <div className="actions card">
            <h2 className="actions-title">Acciones rápidas</h2>
            <div className="actions-list">
              <Link href="/coins" className="action-item">
                <span>💰</span>
                <span>Comprar monedas</span>
              </Link>
              <Link href="/explore" className="action-item">
                <span>🔍</span>
                <span>Explorar directos</span>
              </Link>
              <Link href="/chats" className="action-item">
                <span>💬</span>
                <span>Mis chats</span>
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="action-item">
                  <span>🛡</span>
                  <span>Panel de administrador</span>
                </Link>
              )}
              <button className="action-item action-logout" onClick={handleLogout}>
                <span>🚪</span>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .profile-page { display: flex; flex-direction: column; gap: 1.5rem; max-width: 560px; margin: 0 auto; }

        /* Card */
        .profile-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          flex-wrap: wrap;
          position: relative;
        }

        .edit-btn { margin-left: auto; flex-shrink: 0; }

        .profile-avatar {
          width: 72px;
          height: 72px;
          font-size: 1.75rem;
          flex-shrink: 0;
        }

        .profile-info { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; min-width: 0; }

        .profile-name { font-size: 1.4rem; font-weight: 800; color: var(--text); }
        .profile-handle { color: var(--text-muted); font-size: 0.9rem; }
        .profile-email { color: var(--text-muted); font-size: 0.85rem; }
        .profile-bio { color: var(--text-muted); font-size: 0.85rem; line-height: 1.4; }

        .badge {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          width: fit-content;
        }
        .badge-accent { background: var(--accent-dim); color: var(--accent); border: 1px solid var(--accent); }
        .badge-muted { background: var(--card-hover); color: var(--text-muted); border: 1px solid var(--border); }

        /* Edit form */
        .edit-card { padding: 1.5rem; }
        .edit-title { font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 1.25rem; }
        .edit-form { display: flex; flex-direction: column; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; position: relative; }
        .form-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .bio-input { resize: vertical; min-height: 80px; }
        .char-count { font-size: 0.7rem; color: var(--text-muted); align-self: flex-end; margin-top: 0.2rem; }

        /* Stats */
        .stats-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem; }

        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          padding: 1.25rem;
          text-align: center;
        }

        .stat-icon { font-size: 1.5rem; }
        .stat-value { font-size: 1.25rem; font-weight: 800; color: var(--text); }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }

        /* Actions */
        .actions { padding: 1.5rem; }
        .actions-title { font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 1rem; }
        .actions-list { display: flex; flex-direction: column; gap: 0.25rem; }

        .action-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.875rem;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all var(--transition);
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }

        .action-item:hover { background: var(--card-hover); color: var(--text); }
        .action-logout { color: var(--error) !important; }
        .action-logout:hover { background: rgba(244,67,54,0.1) !important; color: var(--error) !important; }

        /* Skeleton */
        .skeleton-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 3rem; }
        .skeleton-avatar {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(90deg, var(--card) 25%, var(--card-hover) 50%, var(--card) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skeleton-line {
          height: 16px; border-radius: 8px;
          background: linear-gradient(90deg, var(--card) 25%, var(--card-hover) 50%, var(--card) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Error / Success */
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
        }
      `}</style>
    </div>
  );
}

