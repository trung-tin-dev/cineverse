"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  registerSchema,
  type RegisterInput,
} from "../schemas/auth-schema";

import { AuthFormWrapper } from "./auth-form-wrapper";

export default function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);

    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError(
        error.message ?? "Đăng ký thất bại. Vui lòng thử lại!",
      );
      return;
    }

    router.push("/profile");
    router.refresh();
  };

  return (
    <AuthFormWrapper
      title="Tạo tài khoản CineVerse"
      description="Đăng ký để trải nghiệm đặt vé và xem phim mượt mà"
    >
      {/* Server Error */}
      {serverError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="text-sm font-medium text-slate-700"
          >
            Họ và tên
          </label>

          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="name"
              type="text"
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              {...register("name")}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 ${
                errors.name
                  ? "border-red-500 bg-red-50/20"
                  : "border-slate-200"
              }`}
            />
          </div>

          {errors.name && (
            <p className="text-xs text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

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
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Mật khẩu
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Tối thiểu 8 ký tự"
              autoComplete="new-password"
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo tài khoản...
            </>
          ) : (
            "Đăng ký tài khoản"
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-slate-600">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-700"
        >
          Đăng nhập
        </Link>
      </p>
    </AuthFormWrapper>
  );
}