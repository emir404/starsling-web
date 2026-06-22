import {
  Bottleneck,
  Cta,
  Faq,
  Hero,
  HowItWorks,
  MergedPrs,
  Pricing,
  Prs,
  SocialProof,
  Testimonials,
  Video,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Testimonials />
      <Bottleneck />
      <MergedPrs />
      <Prs />
      <Pricing />
      <Faq />
      <Video />
      <Cta />
    </>
  );
}
