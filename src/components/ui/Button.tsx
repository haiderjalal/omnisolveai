import type { ButtonHTMLAttributes, ReactNode } from "react";

import Link from "next/link";

import { ArrowRight, Loader2 } from "lucide-react";

import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "ghost";
type ButtonSize = "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** Show the trailing arrow (default true). */
  arrow?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "text-void bg-[image:var(--gradient-brand)] shadow-glow hover:shadow-[0_0_70px_-6px_rgb(56_232_220/0.7)]",
  ghost: "text-fg glass hover:bg-white/10 hover:border-white/25",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.95rem]",
};

function buttonClasses(variant: ButtonVariant, size: ButtonSize, className?: string): string {
  return cn(
    "group relative inline-flex select-none items-center justify-center gap-2.5 rounded-full font-semibold",
    "transition-[box-shadow,background-color,border-color] duration-500",
    "disabled:pointer-events-none disabled:opacity-60",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}

/** Label that rolls up on hover (two stacked copies, one clipped). */
function RollingLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex overflow-hidden leading-none">
      <span className="block py-0.5 transition-transform duration-500 ease-(--ease-expo) group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full py-0.5 transition-transform duration-500 ease-(--ease-expo) group-hover:translate-y-0 group-focus-visible:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

function Arrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="size-4 transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-1"
    />
  );
}

interface ButtonLinkProps extends BaseProps {
  href: string;
  /** Opens in a new tab (external links). */
  external?: boolean;
}

/**
 * Link styled as a button. Hash links are plain anchors so smooth-scroll can intercept them.
 * The magnetic hover is applied by <PageEffects /> via `data-magnetic`, so this stays plain markup.
 */
export function ButtonLink({
  href,
  external,
  variant = "primary",
  size = "md",
  arrow = true,
  className,
  children,
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  const content = (
    <>
      <RollingLabel>{children}</RollingLabel>
      {arrow && <Arrow />}
    </>
  );

  if (href.startsWith("#") || external) {
    return (
      <a
        href={href}
        className={classes}
        data-magnetic=""
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} data-magnetic="">
      {content}
    </Link>
  );
}

interface ButtonProps
  extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  arrow = true,
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading}
      data-magnetic=""
      {...rest}
    >
      <RollingLabel>{children}</RollingLabel>
      {loading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : arrow && <Arrow />}
    </button>
  );
}
