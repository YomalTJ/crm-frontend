/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { loginUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const result = await loginUser({ username, password });

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
      alert(error.message || "Login failed");
    } finally {
      setIsLoading(false); // Stop loading in both success and error cases
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
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading} // Disable input during loading
                  />
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
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading} // Disable input during loading
                    />
                    <span
                      onClick={() => !isLoading && setShowPassword(!showPassword)} // Only allow toggle when not loading
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
                </div>
                <div>
                  <Button 
                    className="w-full" 
                    size="sm" 
                    type="submit"
                    disabled={isLoading} // Disable button during loading
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