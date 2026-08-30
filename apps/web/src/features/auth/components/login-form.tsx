"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail, LogIn } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  loginSchema,
  type LoginInput,
} from "../schemas/auth-schema";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);

    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });

    if (error) {
      setServerError(
        error.message ?? "Đăng nhập thất bại. Vui lòng thử lại!",
      );
      return;
    }

    const callbackUrl =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("callbackUrl") || "/profile"
        : "/profile";

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/20">
          <LogIn className="h-5 w-5" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Đăng nhập CineVerse
        </h1>

        <p className="mt-1.5 text-sm text-slate-500">
          Chào mừng bạn quay trở lại với CineVerse!
        </p>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-700"
          >
            Email
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              {...register("email")}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 ${
                errors.email
                  ? "border-red-500 bg-red-50/20"
                  : "border-slate-200"
              }`}
            />
          </div>

          {errors.email && (
            <p className="text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Mật khẩu
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-slate-500 hover:text-slate-900 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 ${
                errors.password
                  ? "border-red-500 bg-red-50/20"
                  : "border-slate-200"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2 pt-1">
          <input
            id="rememberMe"
            type="checkbox"
            {...register("rememberMe")}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-900"
          />
          <label
            htmlFor="rememberMe"
            className="text-xs sm:text-sm font-medium text-slate-600 cursor-pointer select-none"
          >
            Ghi nhớ đăng nhập
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>

      {/* Register link */}
      <p className="mt-6 text-center text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-700"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}