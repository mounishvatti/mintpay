import { auth } from "@/auth";
import DashboardClient, { DashboardUser } from "./dashboard-client";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user: DashboardUser | undefined =
    session?.user?.name && session.user.email
      ? {
          name: session.user.name,
          email: session.user.email,
          avatar: session.user.image ?? undefined,
        }
      : undefined;

  return <DashboardClient initialUser={user} />;
}
