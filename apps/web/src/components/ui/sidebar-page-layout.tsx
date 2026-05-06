import { cn } from "@/lib/utils/helpers";

interface SidebarPageLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * SidebarPageLayout — standard two-column page layout with a sticky sidebar.
 *
 * The sidebar is fixed-width on large screens (`lg:w-64 xl:w-80`) and stacks
 * above the main content on smaller screens. The inner sidebar wrapper is
 * `sticky top-28` so it follows the viewport as the user scrolls.
 *
 * Usage:
 * ```tsx
 * <SidebarPageLayout sidebar={<MySidebarContent />}>
 *   <MainContent />
 * </SidebarPageLayout>
 * ```
 */
export function SidebarPageLayout({
  sidebar,
  children,
  className,
}: SidebarPageLayoutProps) {
  return (
    <div
      className={cn(
        "relative mx-auto mt-4 flex w-full flex-col gap-8 px-6 pb-12 lg:flex-row lg:gap-5",
        className,
      )}
    >
      <aside className="w-full shrink-0 lg:w-64 xl:w-80">
        <div className="sticky top-28 flex flex-col gap-2">{sidebar}</div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
