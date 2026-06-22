import { cn } from "@/lib/utils";
import { RadarPing } from "@/components/shared/blueprint-strip";

/**
 * Faint "radar target" overlay for the hero-11 illustration card's bottom-right
 * corner (Figma 286:1885): concentric-ring pings crossed by thin lines,
 * `mix-blend-overlay` at low opacity, clipped by the card. Purely decorative and
 * static; reuses the shared `RadarPing` glyph so the motif matches the site's
 * blueprint backdrops. The caller clips it (card `overflow-hidden`) and owns
 * z-order — it mounts behind the diagram so the animated scene never blends over.
 */
export function OrbitField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute right-0 bottom-0 h-[420px] w-[560px] text-white/50 mix-blend-overlay",
        className,
      )}
    >
      {/* thin crossing lines linking the targets (px units; svg fills the box) */}
      <svg className="absolute inset-0 size-full" fill="none">
        <line x1="40" y1="380" x2="520" y2="120" stroke="currentColor" strokeWidth="1" />
        <line x1="120" y1="420" x2="540" y2="240" stroke="currentColor" strokeWidth="1" />
        <line x1="300" y1="60" x2="480" y2="400" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* radar targets scattered into the corner — partially clipped by the card */}
      <RadarPing className="absolute right-10 bottom-12 size-[120px]" />
      <RadarPing className="absolute right-44 bottom-40 size-[72px]" />
      <RadarPing className="absolute right-6 bottom-48 size-[56px]" />
    </div>
  );
}
