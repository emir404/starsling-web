import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyView } from "@/components/customers/case-study-view";
import { getAllCustomers, getCustomerBySlug } from "@/content/customers";

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
    openGraph: {
      title: customer.headline,
      description: customer.summary,
      type: "article",
      url: `/customers/${customer.slug}`,
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
