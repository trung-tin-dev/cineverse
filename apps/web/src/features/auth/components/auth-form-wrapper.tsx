import type { ReactNode } from "react";

interface AuthFormWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthFormWrapper({
  title,
  description,
  children,
}: AuthFormWrapperProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=85"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Auth Card */}
      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Left - Image */}
        <section className="relative hidden min-h-[620px] w-1/2 lg:block">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
            alt="CineVerse Cinema"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Image content */}
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
            <div className="max-w-md">
              <div className="mb-4 text-4xl">🎬</div>

              <h2 className="text-3xl font-bold tracking-tight">
                Your movie experience starts here.
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/80">
                Discover movies, choose your favourite seats and enjoy a
                seamless cinema experience with CineVerse.
              </p>
            </div>
          </div>
        </section>

        {/* Right - Form */}
        <section className="flex w-full items-center bg-white px-8 py-12 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-md">

            {/* Header */}
            <div className="mb-8">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
                🎬
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>

              {description && (
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              )}
            </div>

            {/* Login / Register form */}
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}