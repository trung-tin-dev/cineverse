import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import { prisma } from "./prisma.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
        input: false, // Prevents client from setting role during signup
      },
    },
  },

  account: {
  accountLinking: {
    enabled: true,
    trustedProviders: ["google"],
  },
},

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  emailVerification: {
    autoSignInAfterVerification: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days when Remember Me is enabled
    updateAge: 60 * 60 * 24,      // 1 day
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const isPasswordReset = type === "forget-password";

        const subject = isPasswordReset
          ? `[CineVerse] Mã xác thực đặt lại mật khẩu: ${otp}`
          : `[CineVerse] Mã xác thực đăng ký tài khoản: ${otp}`;

        const heading = isPasswordReset
          ? "Yêu cầu đặt lại mật khẩu"
          : "Chào mừng bạn đến với CineVerse!";

        const description = isPasswordReset
          ? "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản CineVerse của bạn. Vui lòng nhập mã xác thực OTP 6 chữ số dưới đây để tiếp tục:"
          : "Bạn vừa đăng ký tài khoản trên hệ thống <strong>CineVerse</strong>. Vui lòng nhập mã xác thực OTP gồm 6 chữ số dưới đây để kích hoạt tài khoản:";

        const { data, error } = await resend.emails.send({
          from: process.env.EMAIL_FROM || "CineVerse <onboarding@resend.dev>",
          to: email,
          subject,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 700;">${heading}</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.5;">
                ${description}
              </p>
              <div style="text-align: center; margin: 28px 0;">
                <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0f172a; background-color: #f8fafc; padding: 14px 28px; border-radius: 8px; border: 1px dashed #cbd5e1;">
                  ${otp}
                </span>
              </div>
              <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
                Mã xác thực có hiệu lực trong vòng <strong>5 phút</strong>. Tuyệt đối không chia sẻ mã này với bất kỳ ai.
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-bottom: 0;">
                Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email. Tài khoản của bạn vẫn được bảo mật an toàn.
              </p>
            </div>
          `,
        });

        if (error) {
          console.error(`[Better-Auth] Resend OTP error (${type}):`, error);
          throw new Error(`Failed to send verification OTP: ${error.message}`);
        }

        console.log(`[Better-Auth] Verification OTP sent successfully (${type}):`, data?.id);
      },
      sendVerificationOnSignUp: true,
      expiresIn: 300,
    }),
  ],

  trustedOrigins: ["http://localhost:3000"],
});

export type Auth = typeof auth;