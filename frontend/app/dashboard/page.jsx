"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  useEffect(() => {

    if (status === "unauthenticated") {
      window.location.href = "/login";
      return;
    }

    if (status !== "authenticated") return;

    if (session?.backendToken) {
      localStorage.setItem("token", session.backendToken);
    } else {
      localStorage.removeItem("token");
    }

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

  }, [session, status]);

  if (status === "loading") {
    return null;
  }

  return null;
}
