import { redirect } from "@/i18n/routing";

interface GameLeaguesPageProps {
  params: Promise<{
    gameSlug: string;
    locale: string;
  }>;
}

export default async function GameLeaguesPage({
  params,
}: GameLeaguesPageProps) {
  const { gameSlug, locale } = await params;

  redirect({ href: `/games/${gameSlug}`, locale });
}
