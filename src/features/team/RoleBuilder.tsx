"use client";

import { useState } from "react";

import { BrainCircuit, Check, Database, Layers, Server, ShieldCheck, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import type { Role } from "@/content/home";
import { firePulse } from "@/features/story/sceneState";
import { scrollToHash } from "@/lib/lenis";
import { useStoryStore } from "@/store/storyStore";
import { cn } from "@/utils/cn";

interface RoleBuilderProps {
  roles: readonly Role[];
}

const ICONS: readonly LucideIcon[] = [BrainCircuit, Layers, Database, Server, ShieldCheck];

/**
 * Pick the roles you need. Each pick sends a pulse through the globe, and the summary tray
 * turns the selection into a drafted message for the contact form.
 */
export function RoleBuilder({ roles }: RoleBuilderProps) {
  const [selected, setSelected] = useState<ReadonlySet<number>>(new Set());
  const setInquiryDraft = useStoryStore((state) => state.setInquiryDraft);

  const toggle = (index: number): void => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    firePulse(0.85);
  };

  const titles = roles.filter((_, index) => selected.has(index)).map((role) => role.title);

  const requestTeam = (): void => {
    setInquiryDraft(`I'd like to build a team with: ${titles.join(", ")}.`);
    scrollToHash("#contact");
  };

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {roles.map((role, index) => {
          const Icon = ICONS[index % ICONS.length];
          const isSelected = selected.has(index);
          return (
            <li key={role.title}>
              <Reveal index={index} className="h-full">
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggle(index)}
                  className={cn(
                    "glass spotlight group relative flex h-full w-full flex-col rounded-3xl p-5 text-left transition-[transform,border-color,box-shadow] duration-500 ease-(--ease-expo)",
                    "hover:-translate-y-1",
                    isSelected &&
                      "border-aqua/60 shadow-[0_0_60px_-18px_rgb(56_232_220/0.6),inset_0_1px_0_rgb(255_255_255/0.1)]",
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span
                      className={cn(
                        "grid size-11 place-items-center rounded-2xl border transition-colors duration-500",
                        isSelected ? "border-aqua bg-aqua text-void" : "border-white/10 bg-white/5 text-aqua",
                      )}
                    >
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-6 place-items-center rounded-full border transition-all duration-500",
                        isSelected
                          ? "scale-100 border-aqua bg-aqua/20 text-aqua"
                          : "scale-90 border-white/15 text-transparent",
                      )}
                    >
                      <Check className="size-3.5" />
                    </span>
                  </span>
                  <span className="mt-6 font-display text-lg leading-snug font-semibold text-fg">
                    {role.title}
                  </span>
                  <span className="mt-1.5 text-sm leading-relaxed text-muted">{role.description}</span>
                </button>
              </Reveal>
            </li>
          );
        })}
      </ul>

      <div className="glass mt-6 flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-[0.2em] text-aqua uppercase">Your team</p>
          <p className="mt-1.5 text-sm text-muted" aria-live="polite">
            {titles.length === 0
              ? "Select the roles you need and we'll shape the team around them."
              : `${titles.length} ${titles.length === 1 ? "role" : "roles"} selected: ${titles.join(" · ")}`}
          </p>
        </div>
        <Button onClick={requestTeam} disabled={titles.length === 0} className="shrink-0">
          Request this team
        </Button>
      </div>
    </div>
  );
}
