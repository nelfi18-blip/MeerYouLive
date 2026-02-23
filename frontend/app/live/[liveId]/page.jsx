"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { joinLive, endLive, checkoutLiveAccess, sendGift } from "../../../lib/live";

const GIFT_CATALOG = {
  rose: { label: "Rosa 🌹", amount: 1 },
  heart: { label: "Corazón ❤️", amount: 2 },
  star: { label: "Estrella ⭐", amount: 5 },
  diamond: { label: "Diamante 💎", amount: 10 },
  rocket: { label: "Cohete 🚀", amount: 20 },
};

export default function LivePage({ params }) {
  const liveId = params.liveId;
  const [live, setLive] = useState(null);
  const [error, setError] = useState("");
  const [requiresPurchase, setRequiresPurchase] = useState(false);
  const [requiresSubscription, setRequiresSubscription] = useState(false);
  const [liveToken, setLiveToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const [giftAlert, setGiftAlert] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    joinLive(liveId)
      .then((data) => {
        setLive(data.live);
        setLiveToken(data.liveToken);

        const username = localStorage.getItem("username") || "viewer";
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const socket = io(apiUrl, {
          auth: { token, username },
          transports: ["websocket"],
        });
        socketRef.current = socket;

        socket.on("connect", () => {
          socket.emit("live:join", liveId);
        });

        socket.on("viewers:update", (count) => {
          setViewerCount(count);
        });

        socket.on("chat:message", (msg) => {
          setMessages((prev) => [...prev, msg]);
        });

        socket.on("gift:received", (gift) => {
          setGiftAlert(gift);
          setTimeout(() => setGiftAlert(null), 4000);
        });

        socket.on("live:ended", () => {
          setError("El live ha terminado");
        });

        // Detect if current user is the creator by decoding userId from token
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (data.live && String(data.live.creator?._id || data.live.creator) === String(payload.id)) {
            setIsCreator(true);
          }
        } catch {}
      })
      .catch((err) => {
        if (err.requiresPurchase) setRequiresPurchase(true);
        else if (err.requiresSubscription) setRequiresSubscription(true);
        else setError(err.message);
      });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("live:leave", liveId);
        socketRef.current.disconnect();
      }
    };
  }, [liveId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;
    socketRef.current.emit("chat:message", { liveId, text: newMessage.trim() });
    setNewMessage("");
  };

  const handleEndLive = async () => {
    try {
      await endLive(liveId);
      if (socketRef.current) socketRef.current.emit("live:ended", liveId);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    }
  };

  if (requiresPurchase) {
    return (
      <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 16px" }}>
        <h2>Live privado 🔒</h2>
        <p>Este live requiere un pago para acceder.</p>
        <button onClick={() => checkoutLiveAccess(liveId)}>💳 Comprar acceso</button>
      </div>
    );
  }

  if (requiresSubscription) {
    return (
      <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 16px" }}>
        <h2>Solo suscriptores 🔐</h2>
        <p>Necesitas una suscripción activa para ver este live.</p>
        <a href="/dashboard">Ir al dashboard</a>
      </div>
    );
  }

  if (error) return <p style={{ color: "red", padding: 16 }}>{error}</p>;
  if (!live) return <p style={{ padding: 16 }}>Conectando al live...</p>;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Video area */}
      <div style={{ flex: 1, background: "#000", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            padding: "4px 10px",
            borderRadius: 4,
          }}
        >
          🔴 EN VIVO — {live.title}
        </div>

        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            padding: "4px 10px",
            borderRadius: 4,
          }}
        >
          👁 {viewerCount}
        </div>

        {/* Agora video container */}
        <div
          id="agora-video"
          style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {liveToken ? (
            <p style={{ color: "#aaa", textAlign: "center" }}>
              📡 Stream activo
              {process.env.NEXT_PUBLIC_AGORA_APP_ID
                ? ""
                : " — Integra Agora SDK con NEXT_PUBLIC_AGORA_APP_ID"}
            </p>
          ) : (
            <p style={{ color: "#aaa" }}>Conectando...</p>
          )}
        </div>

        {/* Gift alert */}
        {giftAlert && (
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255,200,0,0.9)",
              color: "#000",
              padding: "8px 20px",
              borderRadius: 20,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            {GIFT_CATALOG[giftAlert.giftType]?.label || "🎁"} de{" "}
            {giftAlert.sender?.username || "alguien"}
          </div>
        )}

        {/* Gift buttons */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
          }}
        >
          {Object.entries(GIFT_CATALOG).map(([key, g]) => (
            <button
              key={key}
              onClick={() => sendGift(liveId, key)}
              title={`${g.label} — $${g.amount}`}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              {g.label.split(" ")[1]}
            </button>
          ))}
        </div>

        {/* End live button for creator */}
        {isCreator && (
          <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)" }}>
            <button
              onClick={handleEndLive}
              style={{ background: "#e53e3e", color: "#fff", border: "none", padding: "6px 16px", borderRadius: 4, cursor: "pointer" }}
            >
              Terminar live
            </button>
          </div>
        )}
      </div>

      {/* Chat sidebar */}
      <div
        style={{
          width: 300,
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid #ddd",
          background: "#fafafa",
        }}
      >
        <div style={{ padding: "10px 12px", borderBottom: "1px solid #ddd", fontWeight: "bold" }}>
          💬 Chat en vivo
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: "bold", color: "#6366f1" }}>{msg.username}</span>
              <span style={{ marginLeft: 6, color: "#333" }}>{msg.text}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div style={{ padding: 8, borderTop: "1px solid #ddd", display: "flex", gap: 6 }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe un mensaje..."
            maxLength={200}
            style={{ flex: 1, padding: "6px 8px", borderRadius: 4, border: "1px solid #ccc" }}
          />
          <button
            onClick={sendMessage}
            style={{ padding: "6px 12px", borderRadius: 4, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer" }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
