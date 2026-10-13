import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="container-x grid min-h-svh place-items-center py-32 text-center">
      <div className="flex max-w-xl flex-col items-center">
        <span className="eyebrow">Error 404</span>
        <h1 className="mt-6 font-display text-4xl font-semibold text-fg sm:text-5xl">
          This page drifted <span className="text-gradient">out of orbit.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on course.
        </p>
        <div className="mt-9">
          <ButtonLink href="/" size="lg">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
