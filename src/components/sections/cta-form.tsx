"use client";

import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CTA_CONTENT } from "@/content/cta";

/**
 * Waitlist email-capture form for the CTA band. Mirrors the hero form
 * (hero-text-group.tsx): no backend yet — submitting routes to the waitlist
 * target. A small client component so the surrounding Cta section can stay a
 * server component.
 */
export function CtaForm() {
  const router = useRouter();
  const { form } = CTA_CONTENT;

  return (
    <form
      className="flex w-full max-w-[457px] gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(form.href);
      }}
    >
      <Input
        type="email"
        name="email"
        aria-label="Email address"
        placeholder={form.placeholder}
        className="flex-1 border-transparent bg-white/15 text-white/80 placeholder:text-white/60 focus-visible:border-white/40 focus-visible:ring-white/20"
      />
      <Button type="submit" className="px-4 text-base">
        {form.cta}
      </Button>
    </form>
  );
}
