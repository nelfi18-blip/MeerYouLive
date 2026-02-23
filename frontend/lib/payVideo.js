export const payVideo = async (videoId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/payments/checkout/${videoId}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al iniciar el pago");
  }

  window.location.href = data.url;
};
