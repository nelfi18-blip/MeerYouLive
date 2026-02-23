"use client";

export default function Upload() {
  const uploadVideo = async e => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const form = new FormData(e.target);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Error al subir el vídeo");
        return;
      }

      alert("Vídeo subido");
    } catch {
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <form onSubmit={uploadVideo}>
      <h1>Subir vídeo</h1>
      <input type="text" name="title" placeholder="Título" required />
      <input type="text" name="description" placeholder="Descripción" />
      <label>
        <input type="checkbox" name="isPrivate" value="true" />
        {" "}Privado
      </label>
      <input type="number" name="price" placeholder="Precio" min="0" defaultValue="0" />
      <input type="file" name="video" accept="video/*" required />
      <button type="submit">Subir</button>
    </form>
  );
}
