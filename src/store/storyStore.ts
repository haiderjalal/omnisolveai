import { create } from "zustand";

import type { ChapterId } from "@/features/story/chapters";

/**
 * Low-frequency UI state only. High-frequency values (camera, globe rotation, scroll
 * progress) live in plain mutable objects — see features/story/sceneState.ts.
 */
export type QualityTier = "high" | "medium" | "low";

interface StoryStore {
  activeChapter: ChapterId;
  /** Index of the industry currently in focus during the pinned tour. */
  industryIndex: number;
  /** null until the client has detected device capability. */
  tier: QualityTier | null;
  /** The visitor prefers reduced motion — scenes render their static variants. */
  reducedMotion: boolean;
  /** The 3D canvas has mounted and started its intro. */
  sceneReady: boolean;
  /** Message drafted by a CTA (e.g. a chosen plan or team) for the contact form. */
  inquiryDraft: string;
  setActiveChapter: (id: ChapterId) => void;
  setIndustryIndex: (index: number) => void;
  setTier: (tier: QualityTier) => void;
  setReducedMotion: (value: boolean) => void;
  setSceneReady: (value: boolean) => void;
  setInquiryDraft: (value: string) => void;
}

export const useStoryStore = create<StoryStore>()((set) => ({
  activeChapter: "hero",
  industryIndex: 0,
  tier: null,
  reducedMotion: false,
  sceneReady: false,
  inquiryDraft: "",
  setActiveChapter: (id) => set({ activeChapter: id }),
  setIndustryIndex: (index) => set({ industryIndex: index }),
  setTier: (tier) => set({ tier }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
  setSceneReady: (value) => set({ sceneReady: value }),
  setInquiryDraft: (value) => set({ inquiryDraft: value }),
}));

/** True when scroll-scrubbed 3D choreography should be replaced with static layouts. */
export function selectStaticMode(state: StoryStore): boolean {
  return state.reducedMotion || state.tier === "low";
}
