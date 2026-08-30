"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "../schemas/auth-schema";

export default function ForgotPasswordForm() {
  const router = useRouter();

  // Step 1: Nhập Email | Step 2: Nhập OTP & Mật khẩu mới | Step 3: Hoàn tất
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  // State cho OTP
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Form Step 1: Nhập Email
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors, isSubmitting: isSubmittingEmail },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // Form Step 2: Mật khẩu mới
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors, isSubmitting: isSubmittingReset },
    reset: resetResetForm,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Countdown timer cho nút Gửi lại mã
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Focus ô đầu tiên khi vào Step 2
  useEffect(() => {
    if (step === 2) {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  // Submit Step 1: Gửi yêu cầu reset password
  const onEmailSubmit = async (data: ForgotPasswordInput) => {
    setServerError(null);

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: "forget-password",
      });

      if (error) {
        setServerError(
          error.message || "Không thể gửi mã xác thực. Vui lòng thử lại sau.",
        );
        return;
      }

      setEmail(data.email);
      setStep(2);
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      resetResetForm();
    } catch (err) {
      console.error("Forgot password request error:", err);
      setServerError("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  // Thay đổi từng ô OTP
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setServerError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Phím Backspace / Arrow trong ô OTP
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Paste OTP 6 số
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];
    digits.forEach((digit, idx) => {
      if (idx < 6) newOtp[idx] = digit;
    });
    setOtp(newOtp);

    const nextFocusIndex = Math.min(digits.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  // Gửi lại mã OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setServerError(null);
    setResendSuccess(false);

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
      });

      if (error) {
        setServerError(
          error.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau.",
        );
      } else {
        setResendSuccess(true);
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setTimeout(() => setResendSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Resend error:", err);
      setServerError("Lỗi gửi mã OTP.");
    } finally {
      setIsResending(false);
    }
  };

  // Submit Step 2: Xác nhận OTP & đổi mật khẩu
  const onResetSubmit = async (data: ResetPasswordInput) => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setServerError("Vui lòng nhập đầy đủ 6 chữ số mã xác thực.");
      return;
    }

    setServerError(null);

    try {
      const { error } = await authClient.emailOtp.resetPassword({
        email,
        otp: otpCode,
        password: data.password,
      });

      if (error) {
        setServerError(
          error.message || "Mã OTP không chính xác hoặc đã hết hạn.",
        );
        return;
      }

      setStep(3);
    } catch (err) {
      console.error("Reset password error:", err);
      setServerError("Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại!");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/20">
          {step === 1 ? (
            <KeyRound className="h-5 w-5" />
          ) : step === 2 ? (
            <Mail className="h-5 w-5 text-amber-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          )}
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {step === 1
            ? "Quên mật khẩu?"
            : step === 2
              ? "Đặt lại mật khẩu"
              : "Hoàn tất đặt lại mật khẩu"}
        </h1>

        <p className="mt-1.5 text-sm text-slate-500">
          {step === 1 ? (
            "Nhập email tài khoản của bạn để nhận mã xác thực đặt lại mật khẩu."
          ) : step === 2 ? (
            <>
              Nhập mã 6 chữ số đã gửi đến{" "}
              <strong className="text-slate-800">{email}</strong> và thiết lập
              mật khẩu mới.
            </>
          ) : (
            "Mật khẩu của bạn đã được cập nhật thành công. Vui lòng đăng nhập bằng mật khẩu mới."
          )}
        </p>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      {/* Resend Success Alert */}
      {resendSuccess && (
        <div className="mb-5 flex items-center space-x-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Mã xác thực mới đã được gửi đến email của bạn!</span>
        </div>
      )}

      {/* BƯỚC 1: NHẬP EMAIL */}
      {step === 1 && (
        <form
          onSubmit={handleSubmitEmail(onEmailSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email tài khoản
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                {...registerEmail("email")}
                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 ${
                  emailErrors.email
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200"
                }`}
              />
            </div>

            {emailErrors.email && (
              <p className="text-xs text-red-500">
                {emailErrors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmittingEmail}
            className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
          >
            {isSubmittingEmail ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi mã...
              </>
            ) : (
              "Gửi mã xác thực"
            )}
          </button>

          <p className="mt-6 text-center text-sm text-slate-600">
            Nhớ mật khẩu?{" "}
            <Link
              href="/login"
              className="font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-700"
            >
              Quay lại Đăng nhập
            </Link>
          </p>
        </form>
      )}

      {/* BƯỚC 2: NHẬP OTP VÀ MẬT KHẨU MỚI */}
      {step === 2 && (
        <form
          onSubmit={handleSubmitReset(onResetSubmit)}
          className="space-y-4"
        >
          {/* OTP 6 Boxes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Mã xác thực 6 số
            </label>
            <div className="flex justify-between gap-2 sm:gap-2.5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isSubmittingReset}
                  className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl border border-slate-300 bg-white text-center text-xl font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
                />
              ))}
            </div>

            {/* Resend Cooldown */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Chưa nhận được mã?</span>
              {countdown > 0 ? (
                <span className="font-medium text-slate-400">
                  Gửi lại sau {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending || isSubmittingReset}
                  className="flex items-center font-semibold text-slate-900 hover:underline disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi lại mã OTP"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5 pt-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Mật khẩu mới
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tối thiểu 8 ký tự"
                autoComplete="new-password"
                {...registerReset("password")}
                className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 ${
                  resetErrors.password
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

            {resetErrors.password && (
              <p className="text-xs text-red-500">
                {resetErrors.password.message}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-slate-700"
            >
              Xác nhận mật khẩu mới
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                autoComplete="new-password"
                {...registerReset("confirmPassword")}
                className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 ${
                  resetErrors.confirmPassword
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {resetErrors.confirmPassword && (
              <p className="text-xs text-red-500">
                {resetErrors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={
                otp.some((d) => !d) || isSubmittingReset
              }
              className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
            >
              {isSubmittingReset ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật mật khẩu...
                </>
              ) : (
                "Cập nhật mật khẩu mới"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setServerError(null);
                setOtp(["", "", "", "", "", ""]);
              }}
              disabled={isSubmittingReset}
              className="flex w-full items-center justify-center space-x-1.5 py-1 text-xs sm:text-sm text-slate-500 hover:text-slate-800 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Đổi email khác</span>
            </button>
          </div>
        </form>
      )}

      {/* BƯỚC 3: HOÀN TẤT THÀNH CÔNG */}
      {step === 3 && (
        <div className="space-y-6 pt-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Đổi mật khẩu thành công!
            </h3>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              Mật khẩu mới của bạn đã có hiệu lực ngay bây giờ. Hãy đăng nhập để
              tiếp tục trải nghiệm CineVerse.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              router.push("/login");
              router.refresh();
            }}
            className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 shadow-sm"
          >
            Đến trang Đăng nhập
          </button>
        </div>
      )}
    </div>
  );
}
