/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { loginUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRecaptcha } from "@/hooks/useRecaptcha";

export default function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const lastSubmitRef = useRef<number>(0);
  const { getRecaptchaToken } = useRecaptcha();

  const validateForm = () => {
    const errors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      errors.username = "Username is required";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearErrors = () => {
    setError(null);
    setFieldErrors({});
  };

  const verifyWithRecaptcha = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: 'login' }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'reCAPTCHA verification failed');
        return false;
      }

      console.log('reCAPTCHA verification successful:', data);
      return true;
    } catch (err) {
      console.error('reCAPTCHA verification error:', err);
      setError('Failed to verify security check');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const now = Date.now();
    if (now - lastSubmitRef.current < 1000) {
      setError("Please wait before trying again");
      return;
    }
    lastSubmitRef.current = now;

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getRecaptchaToken('login');
      if (!recaptchaToken) {
        throw new Error('Failed to verify security check');
      }

      // Verify with reCAPTCHA API
      const isVerified = await verifyWithRecaptcha(recaptchaToken);
      if (!isVerified) {
        setIsLoading(false);
        return;
      }

      // Proceed with login
      const result = await loginUser({ username, password });

      if (result.type === "staff") {
        if (result.locationDetails) {
          localStorage.setItem('staffLocation', JSON.stringify(result.locationDetails));
        }

        sessionStorage.setItem('loginCredentials', JSON.stringify({
          username: result.nic,
          password: result.wbbPassword || password
        }));

        if (result.wbbPassword) {
          sessionStorage.setItem('wbbPassword', result.wbbPassword);
        }
        if (result.nic) {
          sessionStorage.setItem('userNIC', result.nic);
        }

        const staffToken = result.staffAccessToken;

        if (!staffToken) throw new Error("Staff token not found");

        const payloadBase64 = staffToken.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const roleName: string = decodedPayload?.roleName;

        const formattedRole = (roleName || 'staff').toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');

        switch (formattedRole) {
          case 'national-level-user':
            router.push("/dashboard/national-level");
            break;
          case 'district-level-user':
            router.push("/dashboard/district-level");
            break;
          case 'divisional-level-user':
            router.push("/dashboard/divisional-level");
            break;
          case 'bank-zone-level-user':
            router.push("/dashboard/bank-zone-level");
            break;
          case 'gn-level-user':
            router.push("/dashboard/gn-level");
            break;
          default:
            router.push("/dashboard/staff");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error.message);

      const errorMessage = error.message || "Login failed. Please check your credentials and try again.";
      setError(errorMessage);

      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const divRef = useRef<HTMLDivElement>(null);
  const [, setDivSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (divRef.current) {
      const width = divRef.current.offsetWidth;
      const height = divRef.current.offsetHeight;
      setDivSize({ width, height });
      console.log(`Div size: ${width}px × ${height}px`);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center relative overflow-hidden h-screen">
        <Image
          src="/images/logo/login_cover.jpg"
          alt="Woman from Samurdhi"
          className="w-full h-full object-cover"
          fill
          priority
          quality={100}
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12">
        <div className="w-full max-w-xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/logo/samurdhi-login-logo.png"
              alt="Samurdhi Development Logo"
              className="h-22 sm:h-24"
              width={320}
              height={250}
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Sign in - Samurdhi CRM
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Enter your username and password to sign in!
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Nimal"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldErrors.username) {
                      setFieldErrors(prev => ({ ...prev, username: undefined }));
                    }
                  }}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${fieldErrors.username
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } ${isLoading ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              {fieldErrors.username && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors(prev => ({ ...prev, password: undefined }));
                    }
                  }}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 pl-10 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${fieldErrors.password
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } ${isLoading ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  onClick={() => !isLoading && setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-600">
            <p>© 2025 Department of Samurdhi Development</p>
            <p className="mt-2 font-medium text-gray-700">
              Powered by{' '}
              <a
                href="https://erabizsolutions.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Era Biz Solutions
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}