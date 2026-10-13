"use client";

import { Button } from "@/components/ui/Button";
import { scrollToHash } from "@/lib/lenis";
import { useStoryStore } from "@/store/storyStore";

interface PlanButtonProps {
  planName: string;
  label: string;
  featured?: boolean;
}

/** Plan call-to-action: drafts "I'm interested in the X plan" into the contact form and scrolls to it. */
export function PlanButton({ planName, label, featured = false }: PlanButtonProps) {
  const setInquiryDraft = useStoryStore((state) => state.setInquiryDraft);

  const choose = (): void => {
    setInquiryDraft(`I'm interested in the ${planName} plan.`);
    scrollToHash("#contact");
  };

  return (
    <Button onClick={choose} variant={featured ? "primary" : "ghost"} size="lg" className="w-full">
      {label}
    </Button>
  );
}
