import { authClient } from "@/lib/auth-client";
import type { UserRole } from "../types/auth.types";

type AuthUser = NonNullable<
  ReturnType<typeof authClient.useSession>["data"]
>["user"] & {
  role?: UserRole;
};

export function useAuth() {
  const session = authClient.useSession();

  const user = session.data?.user as AuthUser | undefined;

  return {
    session: session.data?.session,
    user,
    role: user?.role,
    isLoading: session.isPending,
    isAuthenticated: !!user,
  };
}