import { RoleGuard } from "@/features/auth/components/role-guard";

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Chỉ ADMIN mới nhìn thấy nội dung này.
        </p>
      </main>
    </RoleGuard>
  );
}