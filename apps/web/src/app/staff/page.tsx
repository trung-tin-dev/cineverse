import { RoleGuard } from "@/features/auth/components/role-guard";

export default function StaffPage() {
  return (
    <RoleGuard allowedRoles={["STAFF", "ADMIN"]}>
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Staff Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          STAFF và ADMIN có thể truy cập.
        </p>
      </main>
    </RoleGuard>
  );
}