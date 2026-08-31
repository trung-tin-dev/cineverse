"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../hooks/use-auth";
import type { UserRole } from "../types/auth.types";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({
  allowedRoles,
  children,
}: RoleGuardProps) {
  const router = useRouter();

  const {
    role,
    isAuthenticated,
    isLoading,
  } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!role || !allowedRoles.includes(role)) {
      router.replace("/unauthorized");
    }
  }, [
    isLoading,
    isAuthenticated,
    role,
    allowedRoles,
    router,
  ]);

  // Đang kiểm tra session
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">
          Đang kiểm tra quyền truy cập...
        </p>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return null;
  }

  // Không có role hoặc không đủ quyền
  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  // Có quyền
  return <>{children}</>;
}