import type { Metadata } from "next";

import { Cta, SocialProof } from "@/components/sections";
import { CustomersIndex } from "@/components/customers/customers-index";
import { getAllCustomers } from "@/content/customers";

export const metadata: Metadata = {
  title: "Customers",
  description:
    "Teams that have upgraded to self-driving CI — case studies from Better Auth, Mastra, and Partcl.",
};

export default function CustomersPage() {
  return (
    <>
      <SocialProof />
      <CustomersIndex customers={getAllCustomers()} />
      <Cta />
    </>
  );
}
