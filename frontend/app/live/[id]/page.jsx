"use client";

import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

export default function Live({ params }) {
  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const roomId = params.id;
    const socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.emit("join-live", { roomId });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onicecandidate = ({ candidate }) => {
          if (candidate) {
            socket.emit("ice", { roomId, candidate });
          }
        };

        socket.on("viewer-joined", async () => {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("offer", { roomId, sdp: offer });
          } catch (err) {
            console.error("Error creating offer:", err);
          }
        });

        socket.on("answer", async ({ sdp }) => {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          } catch (err) {
            console.error("Error setting remote description:", err);
          }
        });

        socket.on("ice", async ({ candidate }) => {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        });
      })
      .catch((err) => {
        setError(`No se pudo acceder a la cámara/micrófono: ${err.message}`);
      });

    return () => {
      socket.off("viewer-joined");
      socket.off("answer");
      socket.off("ice");
      socket.disconnect();
      if (pcRef.current) {
        pcRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [params.id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Live Room: {params.id}</h2>
      <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", maxWidth: 720 }} />
    </div>
  );
}

