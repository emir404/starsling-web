import type { Metadata } from "next";

import { Cta, Results, SocialProof } from "@/components/sections";

export const metadata: Metadata = {
  title: "Customers",
  description: "Engineering teams shipping faster with Starsling.",
};

export default function CustomersPage() {
  return (
    <>
      <SocialProof />
      <Results />
      <Cta />
    </>
  );
}
