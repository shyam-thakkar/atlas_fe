'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthCard } from '@/components/AuthCard';
import { AuthInput } from '@/components/AuthInput';
import { AuthButton } from '@/components/AuthButton';
import { AuthDivider } from '@/components/AuthDivider';
import { GoogleButton } from '@/components/GoogleButton';
import { LandingNavbar } from '@/components/LandingNavbar';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for OAuth error from query params
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError === 'login_failed') {
      setError('Login was cancelled or failed. Please try again.');
    }
  }, [searchParams]);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      // specific redirection happens in AuthContext
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
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
          title="Welcome back"
          description="Enter your email to sign in to your account"
        >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

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
            autoComplete="current-password"
          />

          <AuthButton type="submit" isLoading={isLoading} className="mt-2 text-base">
            Sign in
          </AuthButton>

          <AuthDivider />

          <GoogleButton onClick={handleGoogleLogin}>
            Continue with Google
          </GoogleButton>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline underline-offset-4 transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </AuthCard>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950">
        <LandingNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-500 dark:text-zinc-400">Loading...</div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
