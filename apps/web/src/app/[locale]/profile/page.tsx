import { redirect } from "@/i18n/routing";
import { getServerAuthSession } from "@/auth";

export default async function ProfileRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await getServerAuthSession();
  const { locale } = await params;
  const user = session?.user;

  if (!user) {
    return redirect({ href: "/", locale });
  }

  const target = user.username || user.id;
  return redirect({ href: `/profile/${target}`, locale });
}
