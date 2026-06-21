import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Minus, Plus } from "lucide-react";

import { Section } from "@/components/shared/section";
import { FAQ_ITEMS } from "@/content/faq";

export function Faq() {
  return (
    <Section id="faq">
      <h2 className="text-h2 font-medium">FAQ</h2>
      <AccordionPrimitive.Root
        defaultValue={["0"]}
        className="mt-16 flex w-full flex-col gap-6"
      >
        {FAQ_ITEMS.map((item, i) => (
          <AccordionPrimitive.Item key={item.question} value={String(i)}>
            <AccordionPrimitive.Header>
              <AccordionPrimitive.Trigger className="group/faq flex w-full items-center justify-between gap-4 bg-band px-6 py-5 text-left transition-colors outline-none aria-expanded:bg-brand-muted/10 focus-visible:ring-2 focus-visible:ring-ring">
                <span className="text-xl font-medium tracking-[-0.2px] text-foreground">
                  {item.question}
                </span>
                <Plus className="size-6 shrink-0 text-foreground/60 group-aria-expanded/faq:hidden" />
                <Minus className="hidden size-6 shrink-0 text-foreground/60 group-aria-expanded/faq:block" />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-[starting-style]:h-0 data-[ending-style]:h-0">
              <div className="pt-2">
                <p className="bg-brand-muted/10 px-6 py-5 text-base leading-[1.5] text-foreground/80">
                  {item.answer}
                </p>
              </div>
            </AccordionPrimitive.Panel>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    </Section>
  );
}
