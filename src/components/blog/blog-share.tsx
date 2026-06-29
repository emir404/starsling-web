import { buttonVariants } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Share-to-social links for a post, prefilled with its canonical URL + title. */
export function BlogShare({
  slug,
  title,
  className,
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  const url = `${SITE_CONFIG.url}/blog/${slug}`;
  const targets = [
    {
      label: "Share on X",
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="font-mono text-xs tracking-[0.04em] text-foreground/45 uppercase">
        Share
      </span>
      {targets.map((t) => (
        <a
          key={t.label}
          href={t.href}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          {t.label}
        </a>
      ))}
    </div>
  );
}
