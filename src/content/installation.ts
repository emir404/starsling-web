import type { InstallationContent } from "@/types/content";

export const INSTALLATION: InstallationContent = {
  title: "Install with a one-line change",
  subtitle: "Drop-in replacement for ubuntu-latest.",
  filename: ".github/workflows/ci.yml",
  diff: [
    { marker: "4", text: "build:", tone: "context" },
    { marker: "-", text: "runs-on: ubuntu-latest", tone: "removed" },
    { marker: "+", text: "runs-on: starsling-ubuntu-24.04", tone: "added" },
  ],
};
