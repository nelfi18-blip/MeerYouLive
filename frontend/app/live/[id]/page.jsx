"use client";

import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

export default function Live({ params }) {
  const videoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef();
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [username, setUsername] = useState("");
  const [gifts, setGifts] = useState([]);
  const [mediaError, setMediaError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const socket = io(process.env.NEXT_PUBLIC_API_URL);
    socketRef.current = socket;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsername(data.username || "Viewer"));

    socket.emit("join-live", { roomId: params.id });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        pcRef.current = pc;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit("ice", { roomId: params.id, candidate: e.candidate });
          }
        };

        pc.ontrack = (e) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = e.streams[0];
          }
        };

        socket.on("viewer-joined", async (viewerId) => {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", { roomId: params.id, offer, to: viewerId });
        });

        socket.on("offer", async ({ offer }) => {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { roomId: params.id, answer });
        });

        socket.on("answer", async ({ answer }) => {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on("ice", async ({ candidate }) => {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (_) {}
        });
      })
      .catch((err) => {
        setMediaError(
          `No se pudo acceder a la cámara/micrófono: ${err.message}`
        );
      });

    socket.on("chat-message", ({ username: user, message }) => {
      setMessages((prev) => [...prev, { user, message }]);
    });

    socket.on("gift", ({ username: user, gift }) => {
      setGifts((prev) => [...prev, { user, gift }]);
      setTimeout(() => setGifts((prev) => prev.slice(1)), 3000);
    });

    return () => {
      socket.emit("leave-live", { roomId: params.id });
      pcRef.current?.close();
      socket.disconnect();
    };
  }, [params.id]);

  const sendMessage = () => {
    if (!chatInput.trim() || !socketRef.current) return;
    socketRef.current.emit("chat-message", {
      roomId: params.id,
      message: chatInput,
      username,
    });
    setChatInput("");
  };

  const sendGift = (gift) => {
    if (!socketRef.current) return;
    socketRef.current.emit("gift", { roomId: params.id, gift, username });
  };

  return (
    <div style={{ display: "flex", gap: "16px", padding: "16px" }}>
      <div style={{ flex: 1 }}>
        {mediaError && <p style={{ color: "red" }}>{mediaError}</p>}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ width: "100%", background: "#000", borderRadius: "8px" }}
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
            background: "#111",
            borderRadius: "8px",
            marginTop: "8px",
          }}
        />
        <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
          {["🎁", "❤️", "🔥", "⭐"].map((g) => (
            <button key={g} onClick={() => sendGift(g)}>
              {g}
            </button>
          ))}
        </div>
        {gifts.length > 0 && (
          <div style={{ marginTop: "8px", color: "gold", fontSize: "24px" }}>
            {gifts[0].user} envió {gifts[0].gift}
          </div>
        )}
      </div>
      <div
        style={{
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "8px",
            height: "400px",
            overflowY: "auto",
          }}
        >
          {messages.map((m, i) => (
            <p key={i} style={{ margin: "4px 0" }}>
              <strong>{m.user}:</strong> {m.message}
            </p>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe un mensaje..."
            style={{ flex: 1, padding: "8px", borderRadius: "4px" }}
          />
          <button onClick={sendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
