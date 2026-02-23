export const report = async (videoId, userId, reason = "Contenido inapropiado") => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      video: videoId,
      reportedUser: userId,
      reason
    })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al enviar el reporte");
  }

  alert("Reporte enviado");
};
