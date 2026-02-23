"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const register = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al registrarse");
        return;
      }

      setSuccess("Cuenta creada. Ahora puedes iniciar sesión.");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div>
      <h1>MeetYouLive — Crear cuenta</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña (mín. 6 caracteres)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={register}>Registrarse</button>
      <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
    </div>
  );
}
