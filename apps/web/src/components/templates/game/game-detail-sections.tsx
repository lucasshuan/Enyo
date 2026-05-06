"use client";

import { useState } from "react";
import {
  CalendarDays,
  History,
  MessageSquareText,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { AddEventButton } from "@/components/triggers/game/add-event-button";
import { GameEventsSection } from "@/components/ui/game-events-section";
import { SectionTabs, type SectionTabItem } from "@/components/ui/tabs";
import type {
  GetGameQuery,
  GetLeaguesQuery,
} from "@/lib/apollo/generated/graphql";
import type { SimpleGame } from "@/actions/game";

type GameNode = NonNullable<GetGameQuery["game"]>;
type LeagueNode = NonNullable<GetLeaguesQuery["leagues"]["nodes"][number]>;
type GameSectionId = "events" | "community" | "players" | "matches";

interface GameDetailSectionsProps {
  game: GameNode;
  leagues: LeagueNode[];
  gameSlug: string;
}

export function GameDetailSections({
  game,
  leagues,
  gameSlug,
}: GameDetailSectionsProps) {
  const t = useTranslations("GamePage");
  const [activeTab, setActiveTab] = useState<GameSectionId>("events");
  const tabs: SectionTabItem<GameSectionId>[] = [
    {
      id: "events",
      label: t("sectionTabEvents"),
      count: game._count?.events ?? leagues.length,
      icon: CalendarDays,
    },
    {
      id: "community",
      label: t("sectionTabCommunity"),
      count: 0,
      icon: MessageSquareText,
    },
    {
      id: "players",
      label: t("sectionTabPlayers"),
      count: 0,
      icon: UsersRound,
    },
    {
      id: "matches",
      label: t("sectionTabMatches"),
      count: 0,
      icon: History,
    },
  ];

  return (
    <div>
      <SectionTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        ariaLabel={t("sectionTabsAriaLabel")}
      />

      <section className="mx-auto min-h-[24rem] w-full max-w-[1600px] px-5 pt-5 pb-12 sm:px-6 lg:px-8">
        {activeTab === "events" && (
          <div
            id="events-section-panel"
            role="tabpanel"
            aria-labelledby="events-section-tab"
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <GameEventsSection
              leagues={leagues}
              gameSlug={gameSlug}
              action={
                <AddEventButton
                  gameId={game.id}
                  game={game as SimpleGame}
                  variant="sidebar"
                />
              }
            />
          </div>
        )}

        {activeTab === "community" && (
          <GameEmptySection
            id="community-section-panel"
            tabId="community-section-tab"
            icon={MessageSquareText}
            title={t("communityEmptyTitle")}
            description={t("communityEmptyDescription")}
          />
        )}

        {activeTab === "players" && (
          <GameEmptySection
            id="players-section-panel"
            tabId="players-section-tab"
            icon={UsersRound}
            title={t("playersEmptyTitle")}
            description={t("playersEmptyDescription")}
          />
        )}

        {activeTab === "matches" && (
          <GameEmptySection
            id="matches-section-panel"
            tabId="matches-section-tab"
            icon={History}
            title={t("matchesEmptyTitle")}
            description={t("matchesEmptyDescription")}
          />
        )}
      </section>
    </div>
  );
}

function GameEmptySection({
  id,
  tabId,
  icon: Icon,
  title,
  description,
}: {
  id: string;
  tabId: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={tabId}
      className="animate-in border-gold-dim/25 bg-card/70 fade-in slide-in-from-bottom-2 rounded-3xl border shadow-[0_18px_70px_rgb(0_0_0/0.2),inset_0_1px_0_rgb(255_255_255/0.03)] duration-300"
    >
      <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
        <Icon className="text-secondary mb-4 size-10 opacity-40" />
        <h3 className="text-foreground text-lg font-semibold">{title}</h3>
        <p className="text-muted/45 mt-2 max-w-md text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
