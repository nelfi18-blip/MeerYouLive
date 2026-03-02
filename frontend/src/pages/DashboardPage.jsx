import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${API_URL}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
        if (data) setUser(data);
      })
      .catch(() => setError("No se pudo cargar el perfil"));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Bienvenido, {user.username}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
