import { useTranslations } from "next-intl";
import { FaGithub } from "react-icons/fa";

export function SiteFooter() {
  const t = useTranslations("SiteFooter");
  return (
    <footer className="border-border bg-background/80 relative border-t shadow-[0_-14px_36px_rgb(0_0_0/0.28)] backdrop-blur-xl">
      <div className="text-muted mx-auto flex w-full items-center justify-between gap-4 px-6 py-6 text-xs">
        <span className="font-display tracking-[0.25em] uppercase">
          {t("copyright")}
        </span>
        <a
          href="https://github.com/lucasshuan"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub de lucasshuan"
          className="text-gold hover:bg-gold flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-[#1a1208]"
        >
          <FaGithub className="size-4" />
        </a>
      </div>
    </footer>
  );
}
