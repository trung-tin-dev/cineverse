import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          CineVerse
        </h1>

        <p className="mt-4">
          Cinema Booking Platform
        </p>

        <Button className="mt-6">
          Get Started
        </Button>
      </div>
    </main>
  );
}