"use client";

import { useState } from "react";

export type WaitlistStatus = "idle" | "submitting" | "success" | "error";

/**
 * Shared client logic for the waitlist forms (hero + CTA). Posts the email to
 * the `/api/waitlist` route handler and tracks a small state machine so each
 * form can render its own idle / submitting / success / error UI.
 */
export function useWaitlist() {
  const [status, setStatus] = useState<WaitlistStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(email: string) {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  return { status, error, submit };
}
