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
  const t = await getTranslations("ProfilePage");

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
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            {t("editProfileTitle") ?? "Editar Perfil"}
          </h1>
          <p className="text-muted text-sm mb-10">
            {t("editProfileDescription") ?? "Atualize suas informações pessoais e biografia."}
          </p>

          <form action={updateProfile} className="space-y-8">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-white/70 ml-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue={user.username ?? ""}
                placeholder="seu_username"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-primary/10 transition-all outline-hidden"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium text-white/70 ml-1">
                Biografia
              </label>
              <textarea
                id="bio"
                name="bio"
                defaultValue={user.bio ?? ""}
                placeholder="Conte-nos um pouco sobre você..."
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-primary/10 transition-all outline-hidden resize-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                className={buttonVariants({ intent: "primary", className: "px-8" })}
              >
                {t("saveChanges") ?? "Salvar Alterações"}
              </button>
              <a
                href={`/profile/${user.username || user.id}`}
                className={buttonVariants({ intent: "secondary" })}
              >
                Voltar
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
