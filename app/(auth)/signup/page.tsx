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


  const handleGoogleSuccess = async (response: any) => {
    try {
      setIsLoading(true);
      // Backend expects { id_token: string }
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
          renderGoogleButton('google-signup-btn-overlay');
        }
      }} />
      <AuthCard
        title="Create an account"
        description="Enter your details to get started"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md">
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

          <GoogleButton id="google-signup-btn" onClick={() => { }}>
            Continue with Google
          </GoogleButton>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-gray-900 hover:text-gray-700 hover:underline underline-offset-4 transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
