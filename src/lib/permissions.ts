import { type Session } from "next-auth";
import { type PermissionKey } from "@/server/db/schema";

export function hasPermission(session: Session | null, key: PermissionKey) {
  if (!session?.user) return false;
  if (session.user.isAdmin) return true;
  return session.user.permissions.some((p) => p.key === key);
}
