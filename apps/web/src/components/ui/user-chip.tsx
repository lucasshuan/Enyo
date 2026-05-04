import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils/helpers";
import Image from "next/image";
import { cdnUrl } from "@/lib/utils/cdn";

interface UserChipProps {
  user: {
    id: string;
    name?: string | null;
    imagePath?: string | null;
    username?: string | null;
  };
  className?: string;
}

export function UserChip({ user, className }: UserChipProps) {
  const displayName = user.name ?? user.username ?? "Unknown Player";
  const profileHref = user.username
    ? `/profile/${user.username}`
    : `/profile/${user.id}`;

  return (
    <Link
      href={profileHref}
      className={cn(
        "group bg-card hover:border-gold/40 hover:bg-card-strong inline-flex items-center gap-2 rounded-lg border border-white/10 p-1 transition-all",
        className,
      )}
    >
      <div className="relative size-5 shrink-0 overflow-hidden rounded-md bg-white/10">
        {user.imagePath ? (
          <Image
            src={cdnUrl(user.imagePath)!}
            alt={displayName}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[9px] font-bold text-white/50">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <span className="text-sm font-medium text-white/75 transition-colors group-hover:text-white">
        {displayName}
      </span>
    </Link>
  );
}
