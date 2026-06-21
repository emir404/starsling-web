import {
  Bottleneck,
  Cta,
  Faq,
  Hero,
  HowItWorks,
  Installation,
  Pricing,
  Prs,
  SocialProof,
  Testimonials,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Bottleneck />
      <Testimonials />
      <Prs />
      <HowItWorks />
      <Installation />
      <Pricing />
      <Faq />
      <Cta />
    </>
  );
}
