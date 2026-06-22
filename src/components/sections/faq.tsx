"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { MeshGradient } from "@/components/shared/mesh-gradient";
import { OrbitRings } from "@/components/shared/orbit-rings";
import { Section } from "@/components/shared/section";
import { FAQ_ITEMS } from "@/content/faq";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<string[]>(["0"]);

  return (
    <Section id="faq">
      <h2 className="text-h2 font-medium">FAQ</h2>
      <AccordionPrimitive.Root
        value={open}
        onValueChange={(value) => setOpen(value)}
        className="mt-16 flex w-full flex-col gap-6"
      >
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open.includes(String(i));

          return (
            <AccordionPrimitive.Item key={item.question} value={String(i)}>
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger
                  className={cn(
                    "relative flex w-full items-center justify-between gap-4 overflow-hidden px-6 py-5 text-left outline-none transition-colors duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                    isOpen ? "bg-[#1f8ea2]" : "bg-band",
                  )}
                >
                  {isOpen && (
                    <>
                      <MeshGradient
                        variant="mesh-bright"
                        interactive={false}
                        className="absolute inset-0"
                      />
                      <OrbitRings className="top-1/2 left-[88%] w-[120%] -translate-x-1/2 -translate-y-1/2" />
                    </>
                  )}
                  <span
                    className={cn(
                      "relative z-10 text-xl font-medium tracking-[-0.2px]",
                      isOpen ? "text-white" : "text-foreground",
                    )}
                  >
                    {item.question}
                  </span>
                  {isOpen ? (
                    <Minus className="relative z-10 size-6 shrink-0 text-white" />
                  ) : (
                    <Plus className="relative z-10 size-6 shrink-0 text-foreground/60" />
                  )}
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none data-[starting-style]:h-0 data-[ending-style]:h-0">
                <div className="pt-2">
                  <div className="relative overflow-hidden bg-[#1f8ea2] px-6 py-5">
                    {isOpen && (
                      <>
                        <MeshGradient
                          variant="mesh-bright"
                          interactive={false}
                          className="absolute inset-0"
                        />
                        <OrbitRings className="top-[40%] left-[82%] w-[120%] -translate-x-1/2 -translate-y-1/2" />
                      </>
                    )}
                    <p className="relative z-10 text-base leading-[1.5] text-white">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </AccordionPrimitive.Panel>
            </AccordionPrimitive.Item>
          );
        })}
      </AccordionPrimitive.Root>
    </Section>
  );
}
