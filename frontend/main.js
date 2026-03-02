async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(import.meta.env.VITE_API_URL + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (res.ok) {
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
  } else {
    const data = await res.json().catch(() => ({}));
    alert(data.message || "Inicio de sesión incorrecto");
  }
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}

window.login = login;
window.logout = logout;
