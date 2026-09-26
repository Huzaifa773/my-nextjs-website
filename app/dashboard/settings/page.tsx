import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/SettingsForm";

export default async function DashboardSettingsPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });

  return (
    <div className="rounded-2xl border border-neutral-800 bg-obsidian-900/70 p-6 md:p-8 backdrop-blur-md space-y-6">
      <div className="border-b border-neutral-800 pb-4">
        <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">Account & Security</span>
        <h2 className="font-serif text-2xl font-bold text-ivory mt-0.5">Patron Settings</h2>
      </div>
      <SettingsForm initialName={user!.name} initialPhone={user!.phone || ""} email={user!.email} />
    </div>
  );
}
