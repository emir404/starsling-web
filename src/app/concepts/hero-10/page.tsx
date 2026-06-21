import type { Metadata } from "next";

import { HeroConcept10 } from "@/components/concepts/hero-10/hero-concept-10";

export const metadata: Metadata = {
  title: "Hero Concept 10",
  robots: { index: false, follow: false },
};

export default function HeroConcept10Page() {
  return <HeroConcept10 />;
}
