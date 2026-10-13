"use client";

import { useEffect } from "react";

import { Button, ButtonLink } from "@/components/ui/Button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Route-level error boundary: a calm, human message with a way forward. No internals leak. */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // the digest lets us find the matching server log without exposing details to visitors
    console.error("Route error", error.digest ?? "no-digest");
  }, [error]);

  return (
    <main id="main" className="container-x grid min-h-svh place-items-center py-32 text-center">
      <div className="flex max-w-xl flex-col items-center">
        <span className="eyebrow">Something went wrong</span>
        <h1 className="mt-6 font-display text-4xl font-semibold text-fg sm:text-5xl">
          We hit a snag loading this page.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          It&apos;s on our side, not yours. Try again, or head back to the homepage.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} size="lg">
            Try again
          </Button>
          <ButtonLink href="/" variant="ghost" size="lg" arrow={false}>
            Back to home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
