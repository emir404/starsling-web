import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyView } from "@/components/customers/case-study-view";
import { getAllCustomers, getCustomerBySlug } from "@/content/customers";
import { SITE_CONFIG } from "@/lib/site";

export function generateStaticParams() {
  return getAllCustomers().map((customer) => ({ slug: customer.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const customer = getCustomerBySlug(slug);
  if (!customer) return {};

  return {
    title: `${customer.company} — Customer story`,
    description: customer.summary,
    alternates: { canonical: `/customers/${customer.slug}` },
    openGraph: {
      title: customer.headline,
      description: customer.summary,
      type: "article",
      url: `/customers/${customer.slug}`,
      images: [
        { url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: SITE_CONFIG.ogImageAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: customer.headline,
      description: customer.summary,
      images: [SITE_CONFIG.ogImage],
    },
  };
}

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const customer = getCustomerBySlug(slug);
  if (!customer) notFound();

  const related = getAllCustomers().filter((c) => c.slug !== customer.slug);

  return <CaseStudyView customer={customer} related={related} />;
}
