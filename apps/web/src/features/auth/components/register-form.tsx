"use client";

import { useState, useRef, useEffect } from "react";
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
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  registerSchema,
  type RegisterInput,
} from "../schemas/auth-schema";

export default function RegisterForm() {
  const router = useRouter();

  // Step 1: Điền thông tin đăng ký | Step 2: Nhập OTP xác thực
  const [step, setStep] = useState<1 | 2>(1);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // State cho OTP (6 ô số)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  // Xử lý Submit Step 1: Đăng ký
  const onRegisterSubmit = async (data: RegisterInput) => {
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

    setRegisteredEmail(data.email);
    setStep(2);
    setCountdown(60);
  };

  // Xử lý thay đổi ký tự trong các ô OTP
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Chỉ cho phép số

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Chỉ lấy ký tự cuối nếu người dùng nhập đè
    setOtp(newOtp);
    setServerError(null);

    // Tự động nhảy sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Xử lý phím Backspace và Arrow keys
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

  // Xử lý Paste cả mã OTP 6 số
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

    // Focus vào ô tiếp theo sau các chữ số đã paste
    const nextFocusIndex = Math.min(digits.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  // Xử lý Submit Step 2: Xác thực mã OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setServerError("Vui lòng nhập đầy đủ 6 chữ số mã xác thực.");
      return;
    }

    setServerError(null);
    setIsVerifying(true);

    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email: registeredEmail,
        otp: otpCode,
      });

      if (error) {
        setServerError(
          error.message || "Mã OTP không chính xác hoặc đã hết hạn.",
        );
        setIsVerifying(false);
        return;
      }

      setIsSuccess(true);

      // Chuyển hướng về trang chủ sau khi xác thực thành công
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error("Verification error:", err);
      setServerError("Có lỗi xảy ra khi xác thực. Vui lòng thử lại!");
      setIsVerifying(false);
    }
  };

  // Gửi lại mã OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setServerError(null);
    setResendSuccess(false);

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: registeredEmail,
        type: "email-verification",
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/20">
          {step === 1 ? (
            <User className="h-5 w-5" />
          ) : (
            <Mail className="h-5 w-5 text-amber-400" />
          )}
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {step === 1 ? "Tạo tài khoản CineVerse" : "Xác thực tài khoản"}
        </h1>

        <p className="mt-1.5 text-sm text-slate-500">
          {step === 1 ? (
            "Đăng ký để trải nghiệm đặt vé và xem phim mượt mà"
          ) : (
            <>
              Nhập mã 6 chữ số vừa được gửi đến{" "}
              <strong className="text-slate-800">{registeredEmail}</strong>
            </>
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

      {/* Success State Alert */}
      {isSuccess && (
        <div className="mb-5 flex items-center space-x-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Xác thực thành công! Đang chuyển hướng vào trang chủ...</span>
        </div>
      )}

      {/* BƯỚC 1: FORM ĐĂNG KÝ */}
      {step === 1 ? (
        <form
          onSubmit={handleSubmit(onRegisterSubmit)}
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
            className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
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
        </form>
      ) : (
        /* BƯỚC 2: FORM NHẬP MÃ OTP */
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          {/* OTP 6 Boxes */}
          <div className="flex justify-between gap-2 sm:gap-3">
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
                disabled={isVerifying || isSuccess}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-slate-300 bg-white text-center text-xl sm:text-2xl font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
              />
            ))}
          </div>

          {/* Resend & Cooldown */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
            <span>Chưa nhận được mã?</span>
            {countdown > 0 ? (
              <span className="font-medium text-slate-400">
                Gửi lại sau {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending || isVerifying || isSuccess}
                className="flex items-center font-semibold text-slate-900 hover:underline disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi lại mã OTP"
                )}
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={
                otp.some((d) => !d) || isVerifying || isSuccess
              }
              className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang kích hoạt tài khoản...
                </>
              ) : (
                "Kích hoạt & Vào trang chủ"
              )}
            </button>

            {/* Back button */}
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setServerError(null);
                setOtp(["", "", "", "", "", ""]);
              }}
              disabled={isVerifying || isSuccess}
              className="flex w-full items-center justify-center space-x-1.5 py-1 text-xs sm:text-sm text-slate-500 hover:text-slate-800 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Đổi thông tin hoặc email khác</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}