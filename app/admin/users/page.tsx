import { prisma } from "@/lib/prisma";
import { UsersTable } from "@/components/admin/UsersTable";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true, name: true, email: true, phone: true, isActive: true, createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-charcoal">Customers</h1>
      <UsersTable users={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))} />
    </div>
  );
}
