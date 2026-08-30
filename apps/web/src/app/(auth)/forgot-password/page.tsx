import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";

export const metadata = {
  title: "Quên mật khẩu | CineVerse",
  description: "Khôi phục và đặt lại mật khẩu tài khoản CineVerse của bạn",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
