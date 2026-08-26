"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Shield, LogOut, Loader2, Calendar, Film } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoggingOut(true);
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Signout error:", err);
      setLoggingOut(false);
    }
  };

  // State 1: Đang nạp session
  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center space-x-2 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin text-slate-900" />
          <span className="text-sm font-medium">Đang tải thông tin...</span>
        </div>
      </main>
    );
  }

  // State 2: Chưa đăng nhập hoặc session hết hạn
  if (!session || error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Chưa xác thực
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Bạn cần đăng nhập để truy cập trang thông tin này.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Đến trang đăng nhập
          </Link>
        </div>
      </main>
    );
  }

  // State 3: Đã đăng nhập - hiển thị thông tin
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Film className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-900">CineVerse</span>
          </div>

          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
          </button>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Cover Header */}
          <div className="bg-slate-900 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-700 text-2xl font-bold">
                {session.user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <div>
                <h1 className="text-xl font-bold">{session.user.name}</h1>
                <p className="text-sm text-slate-400">{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* Details Content */}
          <div className="divide-y divide-slate-100 p-6">
            <div className="flex items-center py-3">
              <User className="h-5 w-5 text-slate-400 mr-3" />
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500">Họ và tên</p>
                <p className="text-sm font-medium text-slate-900">{session.user.name}</p>
              </div>
            </div>

            <div className="flex items-center py-3">
              <Mail className="h-5 w-5 text-slate-400 mr-3" />
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500">Địa chỉ Email</p>
                <p className="text-sm font-medium text-slate-900">{session.user.email}</p>
              </div>
            </div>

            <div className="flex items-center py-3">
              <Shield className="h-5 w-5 text-slate-400 mr-3" />
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500">User ID</p>
                <p className="font-mono text-xs text-slate-700">{session.user.id}</p>
              </div>
            </div>

            <div className="flex items-center py-3">
              <Calendar className="h-5 w-5 text-slate-400 mr-3" />
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500">Ngày khởi tạo session</p>
                <p className="text-sm text-slate-700">
                  {new Date(session.session.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}