import type { Metadata } from "next";

import { Cta, Features, Installation, Results } from "@/components/sections";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Faster runners, self-driving optimization, and pricing that beats GitHub Actions.",
};

export default function FeaturesPage() {
  return (
    <>
      <Features />
      <Results />
      <Installation />
      <Cta />
    </>
  );
}
