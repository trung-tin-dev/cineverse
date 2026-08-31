import type { ReactNode } from "react";
import Link from "next/link";
import { Film, Sparkles, Ticket, Popcorn, Armchair } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 bg-slate-950">
      {/* Background ambient lighting and poster blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="h-full w-full object-cover scale-105 opacity-30 blur-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-indigo-950/50" />
      </div>

      {/* Main Auth Card Container */}
      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800/80 bg-white shadow-2xl transition-all duration-300">
        {/* Left - Cinema Poster & Branding (Hidden on mobile, visible on desktop) */}
        <section className="relative hidden min-h-[640px] w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-10 text-white lg:flex">
          {/* Cinema background image */}
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85"
            alt="CineVerse Cinema"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/30" />

          {/* Top: Logo & VIP Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2.5 text-white transition hover:opacity-90"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg shadow-rose-500/20">
                <Film className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">CineVerse</span>
            </Link>

            <span className="inline-flex items-center space-x-1 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              <span>Cinema Experience</span>
            </span>
          </div>

          {/* Bottom: Headline & Features */}
          <div className="relative z-10 max-w-md space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                Trải nghiệm điện ảnh đỉnh cao cùng CineVerse.
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                Khám phá các bom tấn rạp chiếu, đặt chỗ trước trong tích tắc và
                nhận hàng ngàn ưu đãi độc quyền.
              </p>
            </div>

            {/* Feature Perks */}
            <div className="space-y-2.5 border-t border-white/10 pt-5">
              <div className="flex items-center space-x-3 text-xs font-medium text-slate-200">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-amber-400">
                  <Ticket className="h-3.5 w-3.5" />
                </div>
                <span>Đặt vé nhanh chóng, nhận vé điện tử tức thì</span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-medium text-slate-200">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-rose-400">
                  <Armchair className="h-3.5 w-3.5" />
                </div>
                <span>Chọn trước ghế VIP & Sweetbox ưng ý nhất</span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-medium text-slate-200">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-emerald-400">
                  <Popcorn className="h-3.5 w-3.5" />
                </div>
                <span>Combo bắp nước ưu đãi tích điểm thành viên</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right - Form Container */}
        <section className="flex w-full items-center justify-center bg-white px-6 py-10 sm:px-10 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
