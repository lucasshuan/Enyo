import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { getTranslations } from "next-intl/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { updateProfile } from "@/server/user-actions";
import { buttonVariants } from "@/components/ui/button";

export default async function EditProfilePage() {
  const session = await getServerAuthSession();
  const t = await getTranslations("EditProfilePage");

  if (!session?.user) {
    redirect("/");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) redirect("/");

  return (
    <main className="py-12">
      <div className="mx-auto max-w-2xl px-6">
        <div className="glass-panel overflow-hidden rounded-[2.5rem] p-8 md:p-12">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
            {t("editProfileTitle")}
          </h1>
          <p className="text-muted mb-10 text-sm">
            {t("editProfileDescription")}
          </p>

          <form action={updateProfile} className="space-y-8">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="ml-1 text-sm font-medium text-white/70"
              >
                {t("nameLabel")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={user.name ?? ""}
                placeholder={user.name ?? t("namePlaceholder")}
                className="focus:border-primary/50 focus:ring-primary/10 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-hidden transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-4"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="bio"
                className="ml-1 text-sm font-medium text-white/70"
              >
                {t("bioLabel")}
              </label>
              <textarea
                id="bio"
                name="bio"
                defaultValue={user.bio ?? ""}
                placeholder={user.bio ?? t("bioPlaceholder")}
                rows={5}
                className="focus:border-primary/50 focus:ring-primary/10 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-hidden transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-4"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                className={buttonVariants({
                  intent: "primary",
                  className: "px-8",
                })}
              >
                {t("saveChanges")}
              </button>
              <a
                href={`/profile/${user.username || user.id}`}
                className={buttonVariants({ intent: "secondary" })}
              >
                {t("backButton")}
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
