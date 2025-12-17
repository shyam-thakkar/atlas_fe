'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/AuthCard';
import { AuthInput } from '@/components/AuthInput';
import { AuthButton } from '@/components/AuthButton';
import { AuthDivider } from '@/components/AuthDivider';
import { GoogleButton } from '@/components/GoogleButton';
import { auth } from '@/lib/auth';
import { GoogleScript, initializeGoogleOneTap, renderGoogleButton } from '@/lib/googleScript';

import { useAuth } from '@/context/AuthContext';
// ... other imports

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
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
      await login(formData.email, formData.password);
      // specific redirection happens in AuthContext
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      setIsLoading(true);
      await loginWithGoogle(response.credential);
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <GoogleScript onLoad={() => {
        if (initializeGoogleOneTap(handleGoogleSuccess)) {
          renderGoogleButton('google-btn-container-overlay');
        }
      }} />
      <AuthCard
        title="Welcome back"
        description="Enter your email to sign in to your account"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md">
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

          <GoogleButton id="google-btn-container" onClick={() => { }}>
            Continue with Google
          </GoogleButton>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-gray-900 hover:text-gray-700 hover:underline underline-offset-4 transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
