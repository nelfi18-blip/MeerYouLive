"use client";

import { useState } from "react";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";

// TODO: replace with real API data — all profiles share the same placeholder image for now
const DEMO_PROFILES = [
  {
    id: 1,
    name: "Ana",
    age: 24,
    location: "Madrid",
    image: "/demo-profile.jpg",
    bio: "Me encanta el yoga y viajar ✈️",
  },
  {
    id: 2,
    name: "Laura",
    age: 27,
    location: "Barcelona",
    image: "/demo-profile.jpg",
    bio: "Amante del café ☕ y la música en vivo 🎶",
  },
  {
    id: 3,
    name: "Carlos",
    age: 29,
    location: "Valencia",
    image: "/demo-profile.jpg",
    bio: "Fotógrafo y aventurero 📸",
  },
];

const SWIPE_ANIMATION_MS = 350;

export default function ExplorePage() {
  const [profiles, setProfiles] = useState(DEMO_PROFILES);
  const [current, setCurrent] = useState(0);
  const [swipeAction, setSwipeAction] = useState(null);
  const [imgError, setImgError] = useState(false);

  const profile = profiles[current];

  function handleSwipe(type) {
    setSwipeAction(type);
    setImgError(false);
    setTimeout(() => {
      setSwipeAction(null);
      setCurrent((prev) => prev + 1);
    }, SWIPE_ANIMATION_MS);
  }

  if (!profile) {
    return (
      <div className="explore-wrap">
        <div className="no-more-card card-glass">
          <span className="no-more-icon">🎉</span>
          <h2>¡Has visto todos los perfiles!</h2>
          <p>Vuelve más tarde para descubrir más personas.</p>
          <button className="refresh-btn" onClick={() => { setCurrent(0); setImgError(false); }}>
            Volver a empezar
          </button>
        </div>
        <BottomNav active="explore" />
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="explore-wrap">
      <h1 className="explore-title">Explorar</h1>

      <div className={`tinder-card card-glass${swipeAction ? ` swipe-${swipeAction}` : ""}`}>
        {/* Profile image */}
        <div className="card-image-wrap">
          {!imgError ? (
            <Image
              src={profile.image}
              alt={profile.name}
              fill
              style={{ objectFit: "cover" }}
              priority
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="img-fallback" />
          )}
          <div className="card-gradient-overlay" />
        </div>

        {/* Profile info overlay */}
        <div className="card-info">
          <div className="profile-name-row">
            <span className="profile-name">{profile.name}</span>
            <span className="profile-age">{profile.age}</span>
          </div>
          <div className="profile-location">📍 {profile.location}</div>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        </div>
      </div>

      {/* Action buttons */}
      <div className="action-row">
        <button
          className="swipe-btn btn-nope"
          aria-label="No me gusta"
          onClick={() => handleSwipe("left")}
        >
          ❌
        </button>
        <button
          className="swipe-btn btn-superlike"
          aria-label="Super like"
          onClick={() => handleSwipe("super")}
        >
          ⭐
        </button>
        <button
          className="swipe-btn btn-like"
          aria-label="Me gusta"
          onClick={() => handleSwipe("right")}
        >
          ❤️
        </button>
      </div>

      {/* Profile counter */}
      <div className="profile-counter">
        {current + 1} / {profiles.length}
      </div>

      <BottomNav active="explore" />

      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
  .explore-wrap {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1rem 5rem;
    gap: 1.25rem;
  }

  .explore-title {
    font-size: 1.6rem;
    font-weight: 800;
    color: #fff;
    align-self: flex-start;
  }

  /* Tinder card */
  .tinder-card {
    position: relative;
    width: 100%;
    max-width: 380px;
    height: 520px;
    border-radius: 28px;
    overflow: hidden;
    transition: transform 0.35s ease, opacity 0.35s ease;
  }

  .swipe-left  { transform: translateX(-120%) rotate(-20deg); opacity: 0; }
  .swipe-right { transform: translateX(120%)  rotate(20deg);  opacity: 0; }
  .swipe-super { transform: translateY(-120%) scale(0.9);     opacity: 0; }

  .card-image-wrap {
    position: absolute;
    inset: 0;
  }

  .img-fallback {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #ff006a 0%, #6a00ff 100%);
  }

  .card-gradient-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 40%,
      rgba(0, 0, 0, 0.75) 100%
    );
  }

  .card-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.5rem;
    z-index: 2;
  }

  .profile-name-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .profile-name {
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
  }

  .profile-age {
    font-size: 1.5rem;
    font-weight: 400;
    color: rgba(255,255,255,0.85);
  }

  .profile-location {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.8);
    margin-top: 0.25rem;
  }

  .profile-bio {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.7);
    margin-top: 0.5rem;
    line-height: 1.4;
  }

  /* Action buttons */
  .action-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 0.5rem;
  }

  .swipe-btn {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .swipe-btn:active { transform: scale(0.9); }

  .btn-nope {
    background: rgba(255, 59, 48, 0.15);
    box-shadow: 0 4px 20px rgba(255, 59, 48, 0.3);
  }

  .btn-nope:hover {
    background: rgba(255, 59, 48, 0.3);
    box-shadow: 0 6px 24px rgba(255, 59, 48, 0.5);
  }

  .btn-superlike {
    width: 52px;
    height: 52px;
    font-size: 1.4rem;
    background: rgba(255, 214, 0, 0.15);
    box-shadow: 0 4px 20px rgba(255, 214, 0, 0.25);
  }

  .btn-superlike:hover {
    background: rgba(255, 214, 0, 0.3);
    box-shadow: 0 6px 24px rgba(255, 214, 0, 0.45);
  }

  .btn-like {
    background: rgba(255, 45, 138, 0.15);
    box-shadow: 0 4px 20px rgba(255, 45, 138, 0.3);
  }

  .btn-like:hover {
    background: rgba(255, 45, 138, 0.3);
    box-shadow: 0 6px 24px rgba(255, 45, 138, 0.5);
  }

  /* Counter */
  .profile-counter {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.05em;
  }

  /* No more cards */
  .no-more-card {
    margin-top: 4rem;
    padding: 3rem 2rem;
    text-align: center;
    max-width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .no-more-icon { font-size: 3rem; }

  .no-more-card h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
  }

  .no-more-card p {
    color: rgba(255,255,255,0.6);
    font-size: 0.9rem;
  }

  .refresh-btn {
    margin-top: 0.75rem;
    padding: 0.65rem 1.75rem;
    border-radius: 16px;
    border: none;
    background: linear-gradient(135deg, #ff2d8a, #ff006a);
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(255,0,120,0.35);
    transition: opacity 0.15s ease;
  }

  .refresh-btn:hover { opacity: 0.85; }
`;
