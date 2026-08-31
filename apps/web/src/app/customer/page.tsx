import { RoleGuard } from "@/features/auth/components/role-guard";

export default function CustomerPage() {
  return (
    <RoleGuard allowedRoles={["CUSTOMER", "STAFF", "ADMIN"]}>
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Customer Portal
        </h1>

        <p className="mt-2 text-slate-600">
          Người dùng đã đăng nhập có thể truy cập.
        </p>
      </main>
    </RoleGuard>
  );
}