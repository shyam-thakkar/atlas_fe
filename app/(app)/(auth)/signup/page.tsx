'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/AuthCard';
import { AuthInput } from '@/components/AuthInput';
import { AuthButton } from '@/components/AuthButton';
import { AuthDivider } from '@/components/AuthDivider';
import { GoogleButton } from '@/components/GoogleButton';
import { LandingNavbar } from '@/components/LandingNavbar';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signupAndLogin, loginWithGoogle, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // This will now auto-login and redirect
      await signupAndLogin(formData.email, formData.password, formData.fullName);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleLogin = () => {
    // Simply redirect to Google OAuth - no CORS issues
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950">
      <LandingNavbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <AuthCard
          title="Create an account"
          description="Enter your details to get started"
        >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

          <AuthInput
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            autoComplete="name"
          />
          <AuthInput
            label="Email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            autoComplete="email"
          />
          <AuthInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete="new-password"
          />

          <AuthButton type="submit" isLoading={isLoading} className="mt-2 text-base">
            Create account
          </AuthButton>

          <AuthDivider />

          <GoogleButton onClick={handleGoogleLogin}>
            Continue with Google
          </GoogleButton>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-zinc-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline underline-offset-4 transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </AuthCard>
      </div>
    </div>
  );
}
