"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Hls from "hls.js";
import { getStreamUrl } from "../../../lib/liveProvider";

export default function LiveViewerPage({ params }) {
  const [live, setLive] = useState(null);
  const [error, setError] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lives`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar el directo");
        return res.json();
      })
      .then((data) => {
        const found = data.find((l) => l._id === params.id);
        if (!found) throw new Error("Directo no encontrado");
        setLive(found);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  useEffect(() => {
    if (!live || !videoRef.current) return;

    const streamUrl = getStreamUrl(live.streamKey);
    if (!streamUrl) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = streamUrl;
    }
  }, [live]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!live) return <p>Cargando directo…</p>;

  const streamUrl = getStreamUrl(live.streamKey);

  return (
    <div>
      <h1>{live.title}</h1>
      {live.description && <p>{live.description}</p>}
      <p>
        Creador: {live.user?.username ?? "—"} · Espectadores: {live.viewerCount}
      </p>
      {streamUrl ? (
        <video
          ref={videoRef}
          controls
          autoPlay
          style={{ width: "100%", maxWidth: 900 }}
        />
      ) : (
        <p style={{ color: "orange" }}>
          La clave del proveedor de streaming no está configurada
          (NEXT_PUBLIC_LIVE_PROVIDER_KEY).
        </p>
      )}
      <Link href="/live">← Ver todos los directos</Link>
    </div>
  );
}
