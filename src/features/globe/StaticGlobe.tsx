import Image from "next/image";

/**
 * Fallback for devices with no WebGL: the brand mark with a CSS glow. Same layout and
 * content as the 3D version — only the backdrop changes.
 */
export function StaticGlobe() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute top-1/2 right-[-12%] h-[min(78vh,60rem)] aspect-square -translate-y-1/2 md:right-[4%]">
        <div className="absolute inset-[-18%] rounded-full bg-[radial-gradient(closest-side,rgb(56_232_220/0.22),rgb(111_114_245/0.12)_55%,transparent_75%)]" />
        <Image
          src="/brand/omnisolve-mark-dark.png"
          alt=""
          fill
          sizes="(min-width: 768px) 60vh, 90vw"
          className="object-contain opacity-80"
          priority
        />
      </div>
    </div>
  );
}
