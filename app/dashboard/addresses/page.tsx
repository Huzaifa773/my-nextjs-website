import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddressManager } from "@/components/AddressManager";
import { MapPin } from "lucide-react";

export default async function DashboardAddressesPage() {
  const session = await getServerSession(authOptions);
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="rounded-2xl border border-neutral-800 bg-obsidian-900/70 p-6 md:p-8 backdrop-blur-md space-y-6">
      <div className="border-b border-neutral-800 pb-4">
        <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">Delivery Book</span>
        <h2 className="font-serif text-2xl font-bold text-ivory mt-0.5">Saved Addresses</h2>
      </div>
      <AddressManager initialAddresses={addresses} />
    </div>
  );
}
