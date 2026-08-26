"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8">Error: {error.message}</p>;
  if (!session) return <p className="p-8">Not authenticated</p>;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // Chuyển hướng về login sau khi logout
        },
      },
    });
  };

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div>
        <p><strong>Name:</strong> {session.user.name}</p>
        <p><strong>Email:</strong> {session.user.email}</p>
        <p><strong>User ID:</strong> {session.user.id}</p>
      </div>

      <button
        onClick={handleLogout}
        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Logout
      </button>
    </main>
  );
}