import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";

/** Compact hero band used by every inner page: the homepage night-villa photograph, graded for legible white text. */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs: Crumb[];
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#061610] pb-14 pt-28 lg:pb-20 lg:pt-36">
      {/* Same night-villa photograph as the homepage hero, graded for legible white text. */}
      <div aria-hidden="true" className="inner-hero-photo pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white/0"
      />
      <div className="ui-container relative z-10">
        <Breadcrumbs items={crumbs} />
        <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {eyebrow && (
            <p className="eyebrow mt-7 text-forest-400">
              <span className="h-[1px] w-6 bg-current opacity-70" />
              {eyebrow}
            </p>
          )}
          <h1 className="display-2 mt-4 text-white ew-fade-up">{title}</h1>
          {description && <p className="lede mt-4 text-white/70 ew-fade-up ew-d1">{description}</p>}
        </div>
        {children && <div className="mt-8 lg:mt-10">{children}</div>}
      </div>
    </section>
  );
}
