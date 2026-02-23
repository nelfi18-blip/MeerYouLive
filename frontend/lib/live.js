const API = process.env.NEXT_PUBLIC_API_URL;

export const createLive = async (data) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/api/live`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al crear el live");
  return json;
};

export const joinLive = async (liveId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/api/live/${liveId}/join`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw Object.assign(new Error(json.message || "Error al unirse"), json);
  return json;
};

export const endLive = async (liveId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/api/live/${liveId}/end`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al terminar el live");
  return json;
};

export const getLive = async (liveId) => {
  const res = await fetch(`${API}/api/live/${liveId}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Live no encontrado");
  return json;
};

export const listLives = async () => {
  const res = await fetch(`${API}/api/live`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al cargar los lives");
  return json;
};

export const checkoutLiveAccess = async (liveId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/api/live/${liveId}/checkout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al procesar el pago");
  window.location.href = json.url;
};

export const sendGift = async (liveId, giftType) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/api/live/${liveId}/gifts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ giftType }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al enviar el regalo");
  window.location.href = json.url;
};
