import {
  Cta,
  Faq,
  Features,
  Hero,
  Installation,
  MergedPrs,
  Pricing,
  Results,
  SocialProof,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Features />
      <Results />
      <MergedPrs />
      <Installation />
      <Pricing />
      <Faq />
      <Cta />
    </>
  );
}
