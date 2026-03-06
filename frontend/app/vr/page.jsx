"use client";

import Link from "next/link";

export default function VRPage() {
  return (
    <div className="vr-page">
      <div className="vr-header">
        <h1 className="vr-title">🥽 Experiencia VR</h1>
        <p className="vr-sub">
          Sumérgete en eventos y directos en realidad virtual
        </p>
      </div>

      <div className="vr-hero card">
        <div className="vr-scene">
          <span className="vr-icon">🥽</span>
        </div>
        <div className="vr-hero-body">
          <h2 className="vr-hero-title">Próximamente</h2>
          <p className="vr-hero-desc">
            La experiencia VR de MeetYouLive está en desarrollo. Muy pronto
            podrás conectarte a directos, eventos y salas virtuales inmersivas
            desde tu dispositivo VR.
          </p>
        </div>
      </div>

      <div className="vr-features">
        {[
          {
            icon: "🌐",
            title: "Salas inmersivas",
            desc: "Entra a espacios virtuales 360° con otros usuarios.",
          },
          {
            icon: "📡",
            title: "Directos VR",
            desc: "Asiste a transmisiones en vivo en realidad virtual.",
          },
          {
            icon: "🎭",
            title: "Avatares",
            desc: "Personaliza tu avatar y represéntate en el metaverso.",
          },
          {
            icon: "🎁",
            title: "Regalos 3D",
            desc: "Envía regalos animados en 3D durante los eventos.",
          },
        ].map((f) => (
          <div key={f.title} className="vr-feature card">
            <span className="feature-icon">{f.icon}</span>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>

      <p className="back-link">
        <Link href="/dashboard">← Volver al dashboard</Link>
      </p>

      <style jsx>{`
        .vr-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .vr-header { text-align: center; }
        .vr-title { font-size: 2rem; font-weight: 800; color: var(--text); }
        .vr-sub { color: var(--text-muted); margin-top: 0.5rem; }

        .vr-hero {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          flex-wrap: wrap;
        }

        .vr-scene {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 2px solid var(--accent-dim);
        }

        .vr-icon { font-size: 3rem; }

        .vr-hero-body { flex: 1; min-width: 200px; }

        .vr-hero-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 0.75rem;
        }

        .vr-hero-desc { color: var(--text-muted); line-height: 1.7; }

        .vr-features {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .vr-feature {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          text-align: center;
        }

        .feature-icon { font-size: 2rem; }

        .feature-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text);
        }

        .feature-desc { font-size: 0.8rem; color: var(--text-muted); }

        .back-link { text-align: center; }
      `}</style>
    </div>
  );
}
