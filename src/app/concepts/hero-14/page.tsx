import type { Metadata } from "next";

import { HeroConcept14 } from "@/components/concepts/hero-14/hero-concept-14";

export const metadata: Metadata = {
  title: "Hero Concept 14",
  robots: { index: false, follow: false },
};

export default function HeroConcept14Page() {
  return <HeroConcept14 />;
}
