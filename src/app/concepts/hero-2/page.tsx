import type { Metadata } from "next";

import { HeroConcept2 } from "@/components/concepts/hero-2/hero-concept-2";

export const metadata: Metadata = {
  title: "Hero Concept 2",
  robots: { index: false, follow: false },
};

export default function HeroConcept2Page() {
  return <HeroConcept2 />;
}
