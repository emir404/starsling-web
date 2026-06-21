import type { Metadata } from "next";

import { HeroConcept8 } from "@/components/concepts/hero-8/hero-concept-8";

export const metadata: Metadata = {
  title: "Hero Concept 8",
  robots: { index: false, follow: false },
};

export default function HeroConcept8Page() {
  return <HeroConcept8 />;
}
