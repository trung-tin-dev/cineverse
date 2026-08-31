export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">
          403
        </h1>

        <h2 className="mt-2 text-xl font-semibold">
          Access Denied
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Bạn không có quyền truy cập trang này.
        </p>
      </div>
    </main>
  );
}