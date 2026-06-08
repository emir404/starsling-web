import { cn } from "@/lib/utils";

/** Minimal styled code block for the installation snippet. */
export function CodeBlock({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-xl border border-border bg-muted/50 p-4 font-mono text-sm leading-relaxed text-foreground",
        className,
      )}
    >
      <code>{code}</code>
    </pre>
  );
}
