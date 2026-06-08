import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/shared/section";
import { FAQ_ITEMS } from "@/content/faq";

export function Faq() {
  return (
    <Section id="faq">
      <SectionHeading title="Frequently asked questions" />
      <div className="mx-auto mt-10 max-w-2xl">
        <Accordion>
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={item.question} value={String(index)}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
