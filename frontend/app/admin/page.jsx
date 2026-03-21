"use client";

import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      window.location.href = "/login";
      return;
    }
    setToken(t);

    const loadAdminData = async () => {
      try {
        const [overviewRes, usersRes, reportsRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/overview`, {
            headers: { Authorization: `Bearer ${t}` },
          }),
          fetch(`${apiUrl}/api/admin/users`, {
            headers: { Authorization: `Bearer ${t}` },
          }),
          fetch(`${apiUrl}/api/admin/reports`, {
            headers: { Authorization: `Bearer ${t}` },
          }),
        ]);

        if (
          overviewRes.status === 401 || overviewRes.status === 403 ||
          usersRes.status === 401 || usersRes.status === 403 ||
          reportsRes.status === 401 || reportsRes.status === 403
        ) {
          throw new Error("auth");
        }

        if (!overviewRes.ok || !usersRes.ok || !reportsRes.ok) {
          throw new Error("server");
        }

        const overviewData = await overviewRes.json();
        const usersData = await usersRes.json();
        const reportsData = await reportsRes.json();

        setStats(overviewData.stats || null);
        setUsers(usersData.users || []);
        setReports(reportsData.reports || []);
      } catch (err) {
        if (err.message === "auth") {
          setError("No tienes permisos para acceder al panel de administrador.");
        } else {
          setError("Hubo un error cargando los datos del panel de administrador.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const doAction = async (url, method, body, successMsg) => {
    setActionMsg("");
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setActionMsg(`❌ ${d.message || "Error al realizar la acción"}`);
        return;
      }
      const d = await res.json();
      // Refresh users list after user action
      const usersRes = await fetch(`${apiUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
      setActionMsg(`✅ ${successMsg}`);
    } catch {
      setActionMsg("❌ Error de conexión");
    }
  };

  const blockUser = (id) => doAction(`${apiUrl}/api/admin/users/${id}/block`, "PATCH", null, "Usuario bloqueado");
  const unblockUser = (id) => doAction(`${apiUrl}/api/admin/users/${id}/unblock`, "PATCH", null, "Usuario desbloqueado");
  const changeRole = (id, role) => doAction(`${apiUrl}/api/admin/users/${id}/role`, "PATCH", { role }, `Rol cambiado a ${role}`);

  const resolveReport = async (id, status) => {
    setActionMsg("");
    try {
      const res = await fetch(`${apiUrl}/api/moderation/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        setActionMsg("❌ Error al actualizar el reporte");
        return;
      }
      setReports((prev) => prev.filter((r) => r._id !== id));
      setActionMsg("✅ Reporte actualizado");
    } catch {
      setActionMsg("❌ Error de conexión");
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        Cargando panel de administrador…
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">{error}</div>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">🛡 Panel de Administrador</h1>

      {actionMsg && (
        <div className={`action-msg ${actionMsg.startsWith("✅") ? "action-success" : "action-error"}`}>
          {actionMsg}
        </div>
      )}

      {stats && (
        <div className="stats-grid">
          <StatCard title="Usuarios" value={stats.users} icon="👥" />
          <StatCard title="Lives" value={stats.lives} icon="🔴" />
          <StatCard title="Reportes" value={stats.reports} icon="🚨" />
          <StatCard title="Suscripciones" value={stats.subscriptions} icon="⭐" />
          <StatCard title="Admins" value={stats.admins} icon="🛡" />
        </div>
      )}

      <section className="admin-section">
        <h2 className="section-title">Usuarios recientes</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <Th>Nombre</Th>
                <Th>Email</Th>
                <Th>Rol</Th>
                <Th>Estado</Th>
                <Th>Registrado</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="table-row">
                  <Td>{u.name || u.username || "—"}</Td>
                  <Td>{u.email}</Td>
                  <Td>
                    <select
                      className="role-select"
                      value={u.role}
                      onChange={(e) => changeRole(u._id, e.target.value)}
                    >
                      <option value="user">Usuario</option>
                      <option value="creator">Creador</option>
                      <option value="admin">Admin</option>
                    </select>
                  </Td>
                  <Td>
                    <span className={`status-badge ${u.isBlocked ? "status-blocked" : "status-active"}`}>
                      {u.isBlocked ? "Bloqueado" : "Activo"}
                    </span>
                  </Td>
                  <Td>{new Date(u.createdAt).toLocaleDateString("es-ES")}</Td>
                  <Td>
                    {u.isBlocked ? (
                      <button className="action-btn action-unblock" onClick={() => unblockUser(u._id)}>
                        Desbloquear
                      </button>
                    ) : (
                      <button className="action-btn action-block" onClick={() => blockUser(u._id)}>
                        Bloquear
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-row">No hay usuarios</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <h2 className="section-title">Reportes pendientes</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <Th>Tipo</Th>
                <Th>Razón</Th>
                <Th>Estado</Th>
                <Th>Fecha</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id} className="table-row">
                  <Td>{r.targetType}</Td>
                  <Td>{r.reason}</Td>
                  <Td>
                    <span className={`status-badge ${r.status === "pending" ? "status-pending" : "status-active"}`}>
                      {r.status}
                    </span>
                  </Td>
                  <Td>{new Date(r.createdAt).toLocaleDateString("es-ES")}</Td>
                  <Td>
                    <div className="report-actions">
                      <button
                        className="action-btn action-review"
                        onClick={() => resolveReport(r._id, "reviewed")}
                      >
                        Revisado
                      </button>
                      <button
                        className="action-btn action-dismiss"
                        onClick={() => resolveReport(r._id, "dismissed")}
                      >
                        Descartar
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-row">No hay reportes pendientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <style jsx>{`
        .admin-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .admin-loading {
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
        }

        .admin-error {
          padding: 2rem;
          text-align: center;
          color: var(--error);
        }

        .admin-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text);
        }

        .action-msg {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
        }
        .action-success {
          background: rgba(76,175,80,0.1);
          border: 1px solid var(--success);
          color: var(--success);
        }
        .action-error {
          background: rgba(244,67,54,0.1);
          border: 1px solid var(--error);
          color: var(--error);
        }

        /* Stats grid */
        .stats-grid {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Section */
        .admin-section { display: flex; flex-direction: column; gap: 1rem; }
        .section-title { font-size: 1.2rem; font-weight: 700; color: var(--text); }

        /* Table */
        .table-wrap {
          overflow-x: auto;
          border-radius: var(--radius);
          border: 1px solid var(--border);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .table-row { border-bottom: 1px solid var(--border); }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: var(--card-hover); }

        .empty-row {
          padding: 1.5rem;
          text-align: center;
          color: var(--text-muted);
        }

        /* Role select */
        .role-select {
          background: var(--card-hover);
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: var(--radius-sm);
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
          cursor: pointer;
        }

        /* Status badges */
        .status-badge {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-active {
          background: rgba(76,175,80,0.15);
          color: var(--success);
          border: 1px solid var(--success);
        }
        .status-blocked {
          background: rgba(244,67,54,0.12);
          color: var(--error);
          border: 1px solid var(--error);
        }
        .status-pending {
          background: rgba(255,165,0,0.12);
          color: #f59e0b;
          border: 1px solid #f59e0b;
        }

        /* Action buttons */
        .action-btn {
          padding: 0.3rem 0.7rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: opacity 0.2s;
        }
        .action-btn:hover { opacity: 0.8; }

        .action-block {
          background: rgba(244,67,54,0.15);
          color: var(--error);
          border-color: var(--error);
        }
        .action-unblock {
          background: rgba(76,175,80,0.15);
          color: var(--success);
          border-color: var(--success);
        }
        .action-review {
          background: rgba(76,175,80,0.15);
          color: var(--success);
          border-color: var(--success);
        }
        .action-dismiss {
          background: var(--card-hover);
          color: var(--text-muted);
          border-color: var(--border);
        }

        .report-actions { display: flex; gap: 0.4rem; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
      <style jsx>{`
        .stat-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.25rem 1.5rem;
          min-width: 130px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }
        .stat-icon { font-size: 1.5rem; }
        .stat-value { font-size: 2rem; font-weight: 800; color: var(--text); }
        .stat-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
      `}</style>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="table-th">
      {children}
      <style jsx>{`
        .table-th {
          padding: 0.75rem 1rem;
          text-align: left;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--card);
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }
      `}</style>
    </th>
  );
}

function Td({ children }) {
  return (
    <td className="table-td">
      {children}
      <style jsx>{`
        .table-td {
          padding: 0.75rem 1rem;
          color: var(--text);
          font-size: 0.875rem;
          vertical-align: middle;
        }
      `}</style>
    </td>
  );
}

