"use client";

import Link from "next/link";

export default function BottomNav({ active }) {
  return (
    <div className="bottom-nav flex justify-around py-4 text-sm">

      <Link href="/explore">
        <div className={active==="explore" ? "text-pink-500" : "text-gray-400"}>
          Explorar
        </div>
      </Link>

      <Link href="/live">
        <div className={active==="live" ? "text-pink-500" : "text-gray-400"}>
          Live
        </div>
      </Link>

      <Link href="/chats">
        <div className={active==="chats" ? "text-pink-500" : "text-gray-400"}>
          Chats
        </div>
      </Link>

      <Link href="/profile">
        <div className={active==="profile" ? "text-pink-500" : "text-gray-400"}>
          Perfil
        </div>
      </Link>

    </div>
  );
}
