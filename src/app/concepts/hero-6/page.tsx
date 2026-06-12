import type { Metadata } from "next";

import { HeroConcept6 } from "@/components/concepts/hero-6/hero-concept-6";

export const metadata: Metadata = {
  title: "Hero Concept 6",
  robots: { index: false, follow: false },
};

export default function HeroConcept6Page() {
  return <HeroConcept6 />;
}
