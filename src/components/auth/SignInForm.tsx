/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { loginUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

export default function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setAttemptCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{username?: string; password?: string}>({});
  const lastSubmitRef = useRef<number>(0);

  const validateForm = () => {
    const errors: {username?: string; password?: string} = {};
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const now = Date.now();
    if (now - lastSubmitRef.current < 1000) {
      setError("Please wait before trying again");
      return;
    }
    lastSubmitRef.current = now;
    
    // Validate form fields
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser({ username, password });
      setAttemptCount(0);
      clearErrors();

      if (result.type === "staff") {
        if (result.locationDetails) {
          localStorage.setItem('staffLocation', JSON.stringify(result.locationDetails));
        }

        // Store login credentials for API testing - use NIC instead of username
        sessionStorage.setItem('loginCredentials', JSON.stringify({
          username: result.nic, // Use NIC instead of username
          password: result.wbbPassword || password // Use WBB password if available
        }));

        // Also store WBB password and NIC separately for reference
        if (result.wbbPassword) {
          sessionStorage.setItem('wbbPassword', result.wbbPassword);
        }
        if (result.nic) {
          sessionStorage.setItem('userNIC', result.nic);
        }

        // Get token from cookie
        const res = await fetch("/api/auth/get-staff-token");
        const { token } = await res.json();

        if (!token) throw new Error("Staff token not found");

        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(
          atob(payloadBase64)
        );

        const roleName: string = decodedPayload?.roleName;

        if (!roleName) {
          console.warn("No role name in token, redirecting to /dashboard/staff");
          router.push("/dashboard/staff");
          return;
        }

        // Format role name (e.g., "Bank/Zone Level User" → "bank-zone-level-user")
        const formattedRole = roleName.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');

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
      
      // Set user-friendly error messages
      const errorMessage = error.message || "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
      
      // Clear password field on error for security
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            {/* Error Message */}
            {error && (
              <div className="p-3 mb-6 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="username">
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    id="username" 
                    name="username" 
                    placeholder="nimal" 
                    type="text" 
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (fieldErrors.username) {
                        setFieldErrors(prev => ({...prev, username: undefined}));
                      }
                    }}
                    disabled={isLoading}
                    className={fieldErrors.username ? "border-error-500 focus:border-error-500 focus:ring-error-500" : ""}
                  />
                  {fieldErrors.username && (
                    <p className="mt-1 text-sm text-error-500">{fieldErrors.username}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors(prev => ({...prev, password: undefined}));
                        }
                      }}
                      disabled={isLoading}
                      className={fieldErrors.password ? "border-error-500 focus:border-error-500 focus:ring-error-500" : ""}
                    />
                    <span
                      onClick={() => !isLoading && setShowPassword(!showPassword)}
                      className={`absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm text-error-500">{fieldErrors.password}</p>
                  )}
                </div>
                <div>
                  <Button 
                    className="w-full" 
                    size="sm" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}