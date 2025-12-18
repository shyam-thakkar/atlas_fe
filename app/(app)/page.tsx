import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 items-center text-center max-w-md w-full">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Atlas</h1>
          <p className="mt-2 text-lg text-gray-500">Authentication UI Demo</p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Link href="/login" className="w-full">
            <AuthButton>View Login Page</AuthButton>
          </Link>
          <Link href="/signup" className="w-full">
            <AuthButton className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm">View Signup Page</AuthButton>
          </Link>
        </div>
      </main>
    </div>
  );
}
