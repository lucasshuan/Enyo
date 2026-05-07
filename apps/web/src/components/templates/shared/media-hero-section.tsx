import Image from "next/image";

import { cn } from "@/lib/utils/helpers";

interface MediaHeroSectionProps {
  backgroundSrc: string | null;
  children: React.ReactNode;
  className?: string;
  backgroundAlt?: string;
}

export function MediaHeroSection({
  backgroundSrc,
  children,
  className,
  backgroundAlt = "",
}: MediaHeroSectionProps) {
  return (
    <section
      className={cn(
        "bg-card/25 relative isolate min-h-52.5 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 mask-[linear-gradient(to_bottom,black_50%,transparent_100%)]">
        {backgroundSrc ? (
          <Image
            src={backgroundSrc}
            alt={backgroundAlt}
            fill
            priority
            className="object-cover object-center opacity-70"
            sizes="100vw"
          />
        ) : (
          <div className="from-primary/22 via-background-soft/85 to-background absolute inset-0 bg-linear-to-br" />
        )}

        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_82%_42%,transparent_0%,transparent_24%,rgb(13_12_14/0.92)_100%),linear-gradient(90deg,rgb(13_12_14/0.98)_0%,rgb(13_12_14/0.88)_31%,rgb(13_12_14/0.46)_58%,rgb(13_12_14/0.82)_100%)]"
        />
      </div>

      {children}

      <div className="h-2 sm:h-3" />
    </section>
  );
}
