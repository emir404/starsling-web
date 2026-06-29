"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CTA_CONTENT } from "@/content/cta";
import { useWaitlist } from "@/hooks/use-waitlist";

/**
 * Waitlist email-capture form for the CTA band (on the dark #191F20 panel).
 * Posts to the `/api/waitlist` route handler (Resend) and swaps to a
 * confirmation on success; mirrors the hero form's behavior.
 */
export function CtaForm() {
  const { form } = CTA_CONTENT;
  const { status, error, submit } = useWaitlist();
  const [email, setEmail] = useState("");

  if (status === "success") {
    return (
      <p className="flex w-full max-w-[457px] items-center gap-2.5 font-mono text-sm uppercase tracking-[0.02em] text-white">
        <span aria-hidden className="size-3 shrink-0 bg-[#30a6bb]" />
        You’re on the list — we’ll be in touch.
      </p>
    );
  }

  return (
    <form
      className="w-full max-w-[457px]"
      onSubmit={(event) => {
        event.preventDefault();
        submit(email);
      }}
    >
      <div className="flex w-full gap-2">
        <Input
          type="email"
          name="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-label="Email address"
          aria-invalid={status === "error" || undefined}
          disabled={status === "submitting"}
          placeholder={form.placeholder}
          className="flex-1 border-transparent bg-white/15 text-white/80 placeholder:text-white/60 focus-visible:border-white/40 focus-visible:ring-white/20"
        />
        <Button type="submit" disabled={status === "submitting"} className="px-4 text-base">
          {status === "submitting" ? "Joining…" : form.cta}
        </Button>
      </div>
      {status === "error" ? (
        <p role="alert" className="mt-2 font-mono text-xs text-[#ff8585]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
