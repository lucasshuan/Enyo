import { cdnUrl } from "@/lib/utils/cdn";

export type SessionUser = {
  id?: string;
  username?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  imagePath?: string | null;
  isAdmin?: boolean;
};

export function getSessionAvatarSrc(user: SessionUser | null | undefined) {
  return cdnUrl(user?.imagePath) ?? user?.image ?? null;
}

export function getSessionDisplayName(
  user: SessionUser | null | undefined,
  fallback: string,
) {
  return user?.name ?? user?.username ?? fallback;
}

export function getSessionProfileHandle(user: SessionUser | null | undefined) {
  return user?.username ?? user?.id ?? null;
}
