"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  ChevronsRight,
  Eye,
  LogIn,
  LogOut,
  Pencil,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils/helpers";
import { buttonVariants } from "@/components/ui/button";
import { AuthModal } from "@/components/modals/auth/auth-modal";
import {
  getSessionAvatarSrc,
  getSessionDisplayName,
  getSessionProfileHandle,
  type SessionUser,
} from "@/components/layout/session-user";

type SiteUserSidebarProps = {
  open: boolean;
  onClose: () => void;
};

type SidebarPanelTab = "friends" | "groups";

function AccountAvatar({
  user,
  avatarSrc,
  size = "lg",
}: {
  user?: SessionUser | null;
  avatarSrc: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const imageSize = size === "lg" ? 56 : size === "md" ? 44 : 24;

  return (
    <div className="relative shrink-0">
      {avatarSrc ? (
        <Image
          src={avatarSrc}
          alt={user?.name ?? user?.username ?? "Avatar"}
          width={imageSize}
          height={imageSize}
          className={cn(
            "ring-border rounded-full object-cover ring-1",
            size === "lg" && "size-14",
            size === "md" && "size-11",
            size === "sm" && "size-6",
          )}
        />
      ) : (
        <div
          className={cn(
            "ring-border bg-secondary/8 flex items-center justify-center rounded-full ring-1",
            size === "sm" && "size-6",
            size === "md" && "size-11",
            size === "lg" && "size-14",
          )}
        >
          <User
            className={cn(
              "text-[color-mix(in_srgb,var(--secondary)_45%,var(--background))]",
              size === "lg" && "size-6",
              size === "md" && "size-5",
              size === "sm" && "size-3.5",
            )}
          />
        </div>
      )}
    </div>
  );
}

function AccountAction({
  icon: Icon,
  label,
  ariaLabel,
  href,
  onClose,
  onClick,
  disabled = false,
  variant = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  ariaLabel?: string;
  href?: string;
  onClose: () => void;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}) {
  const className = cn(
    "focus-visible:ring-gold/40 relative flex h-12 min-w-0 flex-col items-center justify-center gap-1 border border-transparent px-1 text-[10px] leading-none font-semibold transition-colors focus-visible:z-10 focus-visible:border-gold focus-visible:ring-2 focus-visible:outline-none first:rounded-bl-[7px] last:rounded-br-[7px]",
    disabled &&
      "cursor-default text-[color-mix(in_srgb,var(--secondary)_32%,var(--background))]",
    !disabled &&
      variant === "default" &&
      "text-secondary/65 hover:z-10 hover:border-gold hover:bg-primary/12 hover:text-gold",
    !disabled &&
      variant === "danger" &&
      "text-destructive/75 hover:z-10 hover:border-gold hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/40",
  );
  const content = (
    <>
      <Icon className="size-3.5 shrink-0" />
      <span className="w-full truncate text-center">{label}</span>
    </>
  );
  const accessibleLabel = ariaLabel ?? label;

  if (disabled || (!href && !onClick)) {
    return (
      <button
        type="button"
        disabled
        aria-label={accessibleLabel}
        title={accessibleLabel}
        className={className}
      >
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClose}
        aria-label={accessibleLabel}
        title={accessibleLabel}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={accessibleLabel}
      title={accessibleLabel}
      className={className}
    >
      {content}
    </button>
  );
}

function PanelTabButton({
  active,
  count,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "focus-visible:ring-gold/40 relative flex h-9 min-w-0 items-center justify-center gap-1.5 px-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
        "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:transition-colors",
        active
          ? "text-foreground after:bg-gold/70"
          : "text-secondary/50 hover:text-secondary/80 after:bg-transparent",
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="min-w-0 truncate">{label}</span>
      <span
        className={cn(
          "flex min-w-4 shrink-0 items-center justify-center rounded-sm px-1 text-[10px] leading-4",
          active ? "text-secondary/70" : "text-secondary/25",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyPanelState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-72 flex-col items-center justify-center px-4 py-8 text-center">
      <div className="border-border bg-card-strong/70 flex size-12 items-center justify-center rounded-lg border shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
        <Icon className="text-gold size-5 opacity-80" />
      </div>
      <h2 className="text-secondary mt-4 text-sm font-semibold">{title}</h2>
      <p className="text-muted/60 mt-1 max-w-48 text-xs leading-5">
        {description}
      </p>
      {children && <div className="mt-4 w-full max-w-44">{children}</div>}
    </div>
  );
}

export function SiteUserSidebarTrigger({
  accountLabel,
  open,
  onClick,
}: {
  accountLabel: string;
  open: boolean;
  onClick: () => void;
}) {
  const { data: session, status } = useSession();
  const user = session?.user as SessionUser | undefined;
  const avatarSrc = getSessionAvatarSrc(user);
  const label = user ? getSessionDisplayName(user, accountLabel) : accountLabel;
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleClick = () => {
    if (status !== "loading" && !user) {
      setAuthModalOpen(true);
    } else {
      onClick();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={accountLabel}
        title={label}
        aria-expanded={user ? open : undefined}
        className={cn(
          "focus-visible:ring-gold/40 relative flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none",
          open && user
            ? "bg-primary/15 text-secondary"
            : "text-secondary/70 hover:bg-gold-dim/10 hover:text-secondary",
        )}
      >
        {status === "loading" ? (
          <span className="bg-secondary/10 size-5 animate-pulse rounded-full" />
        ) : (
          <AccountAvatar user={user} avatarSrc={avatarSrc} size="sm" />
        )}
      </button>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        isPending={false}
      />
    </>
  );
}

export function SiteUserSidebar({ open, onClose }: SiteUserSidebarProps) {
  const { data: session, status } = useSession();
  const user = session?.user as SessionUser | undefined;
  const avatarSrc = getSessionAvatarSrc(user);
  const profileHandle = getSessionProfileHandle(user);
  const profileHref = profileHandle ? `/profile/${profileHandle}` : undefined;
  const editProfileHref = profileHandle
    ? `/profile/${profileHandle}/edit`
    : undefined;
  const t = useTranslations("Sidebar");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarPanelTab>("friends");

  const openAuthModal = () => {
    onClose();
    setAuthModalOpen(true);
  };

  const tabContent = {
    friends: {
      icon: UserPlus,
      title: t("friendsEmptyTitle"),
      description: t("friendsEmptyDescription"),
    },
    groups: {
      icon: Users,
      title: t("groupsEmptyTitle"),
      description: t("groupsEmptyDescription"),
    },
  } satisfies Record<
    SidebarPanelTab,
    {
      icon: React.ComponentType<{ className?: string }>;
      title: string;
      description: string;
    }
  >;

  const activeContent = tabContent[activeTab];

  return (
    <>
      <aside
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={cn(
          "border-border bg-card/95 fixed inset-y-0 right-0 z-60 flex h-full w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden border-l shadow-2xl backdrop-blur-xl",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="shrink-0 px-3 pt-3 pb-2">
          <div className="flex h-7 items-center justify-between gap-2">
            <span className="text-gold-dim inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.18em] uppercase">
              <span className="bg-gold-dim/50 h-px w-3 shrink-0" />
              {t("accountTitle")}
              <span className="bg-gold-dim/50 h-px w-3 shrink-0" />
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("closeAccount")}
              title={t("closeAccount")}
              className="hover:bg-primary/10 hover:text-secondary focus-visible:ring-gold/40 flex size-6 shrink-0 items-center justify-center rounded-sm text-[color-mix(in_srgb,var(--secondary)_45%,var(--background))] transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ChevronsRight className="size-3.5" />
            </button>
          </div>

          {status === "loading" ? (
            <div className="border-border/70 bg-card-strong/50 mt-3 rounded-lg border p-2">
              <div className="flex items-center gap-2.5">
                <div className="bg-secondary/10 size-11 animate-pulse rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="bg-secondary/10 h-4 w-28 animate-pulse rounded" />
                  <div className="bg-secondary/7 h-3 w-16 animate-pulse rounded" />
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <div className="bg-secondary/7 size-9 animate-pulse rounded-md" />
                  <div className="bg-secondary/7 size-9 animate-pulse rounded-md" />
                </div>
              </div>
            </div>
          ) : user ? (
            <div className="mt-3">
              <div className="border-border/70 from-card-strong/90 to-card/70 overflow-hidden rounded-t-lg border border-b-0 bg-linear-to-br px-2 py-1.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
                <div className="flex items-center gap-2.5">
                  <AccountAvatar user={user} avatarSrc={avatarSrc} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-baseline gap-2">
                      <span className="text-foreground truncate text-sm leading-snug font-semibold">
                        {getSessionDisplayName(user, "User")}
                      </span>
                      {user.username && (
                        <span className="text-muted/50 shrink-0 text-xs">
                          @{user.username}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex min-w-0 items-center gap-1.5">
                      <span className="bg-success size-1.5 shrink-0 rounded-full" />
                      <span className="text-success shrink-0 text-[11px] leading-none font-medium">
                        {t("online")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-border/70 divide-border/45 grid grid-cols-4 divide-x overflow-hidden rounded-b-lg border bg-black/10">
                <AccountAction
                  icon={Eye}
                  label={t("userMenu.viewProfile")}
                  href={profileHref}
                  onClose={onClose}
                  disabled={!profileHref}
                />
                <AccountAction
                  icon={Pencil}
                  label={t("userMenu.editProfileShort")}
                  ariaLabel={t("userMenu.editProfile")}
                  href={editProfileHref}
                  onClose={onClose}
                  disabled={!editProfileHref}
                />
                <AccountAction
                  icon={Settings}
                  label={t("userMenu.configure")}
                  ariaLabel={`${t("userMenu.editAccount")} - ${t("soon")}`}
                  onClose={onClose}
                  disabled
                />
                <AccountAction
                  icon={LogOut}
                  label={t("userMenu.logout")}
                  onClose={onClose}
                  onClick={() => {
                    onClose();
                    void signOut();
                  }}
                  variant="danger"
                />
              </div>
            </div>
          ) : (
            <div className="border-border/70 from-card-strong/90 to-card/70 mt-3 overflow-hidden rounded-lg border bg-linear-to-br p-2.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
              <div className="flex items-center gap-2.5">
                <AccountAvatar user={null} avatarSrc={null} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="text-foreground truncate text-sm font-semibold">
                    {t("guest")}
                  </div>
                  <div className="text-muted/60 truncate text-xs">
                    {t("signedOut")}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={openAuthModal}
                className={cn(
                  buttonVariants({ intent: "primary" }),
                  "mt-2 h-9 w-full gap-2 rounded-lg px-4 text-sm",
                )}
              >
                <LogIn className="size-4 shrink-0" />
                <span>{t("userMenu.login")}</span>
              </button>
            </div>
          )}
        </div>

        <section className="min-h-0 flex-1 px-3 pt-1.5 pb-3">
          <div className="border-border/70 flex h-full min-h-0 flex-col overflow-hidden rounded-lg border bg-[radial-gradient(ellipse_100%_48%_at_50%_0%,color-mix(in_srgb,var(--gold)_7%,transparent),transparent_62%),linear-gradient(180deg,color-mix(in_srgb,var(--card-strong)_72%,transparent),color-mix(in_srgb,var(--card)_80%,transparent))] shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
            <div
              role="tablist"
              aria-label={t("activityTabsAriaLabel")}
              className="border-border/70 grid grid-cols-2 border-b"
            >
              <PanelTabButton
                active={activeTab === "friends"}
                count={0}
                icon={UserPlus}
                label={t("friends")}
                onClick={() => setActiveTab("friends")}
              />
              <PanelTabButton
                active={activeTab === "groups"}
                count={0}
                icon={Users}
                label={t("groups")}
                onClick={() => setActiveTab("groups")}
              />
            </div>

            <div
              role="tabpanel"
              className="custom-scrollbar min-h-0 flex-1 overflow-y-auto"
            >
              {user ? (
                <EmptyPanelState
                  icon={activeContent.icon}
                  title={activeContent.title}
                  description={activeContent.description}
                />
              ) : (
                <EmptyPanelState
                  icon={LogIn}
                  title={t("signedOutPanelTitle")}
                  description={t("signedOutPanelDescription")}
                >
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className={cn(
                      buttonVariants({ intent: "secondary" }),
                      "h-8 w-full rounded-lg px-3 text-xs",
                    )}
                  >
                    {t("userMenu.login")}
                  </button>
                </EmptyPanelState>
              )}
            </div>
          </div>
        </section>
      </aside>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        isPending={false}
      />
    </>
  );
}
