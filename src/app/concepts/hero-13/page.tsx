import type { Metadata } from "next";

import { HeroConcept13 } from "@/components/concepts/hero-13/hero-concept-13";

export const metadata: Metadata = {
  title: "Hero Concept 13",
  robots: { index: false, follow: false },
};

export default function HeroConcept13Page() {
  return <HeroConcept13 />;
}
