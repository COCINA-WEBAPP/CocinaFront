"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateVisitorId(): string {
  if (typeof document === "undefined") return "";

  const cookieName = "_cocina_uid";
  const existing = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`));

  if (existing) {
    return existing.split("=")[1];
  }

  const uid = generateUUID();
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `${cookieName}=${uid}; path=/; max-age=${maxAge}; SameSite=Lax`;
  return uid;
}

export function AnalyticsTracker() {
  useEffect(() => {
    const uid = getOrCreateVisitorId();
    if (uid) {
      track("page_view", { uid });
    }
  }, []);

  return null;
}
