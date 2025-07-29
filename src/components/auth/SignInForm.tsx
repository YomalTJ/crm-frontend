/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Checkbox from "@/components/form/input/Checkbox";
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
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginUser({ username, password });

      console.log("result: ", result);

      if (result.type === "admin") {
        console.log("Admin login success");
        router.push("/dashboard/admin");
        return;
      }

      if (result.type === "staff") {
        console.log("Staff login success, decoding staffAccessToken...");
        console.log("Location details:", result.locationDetails);

        if (result.locationDetails) {
          localStorage.setItem('staffLocation', JSON.stringify(result.locationDetails));
        }

        // Get token from cookie
        const res = await fetch("/api/auth/get-staff-token");
        const { token } = await res.json();

        if (!token) throw new Error("Staff token not found");

        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(
          atob(payloadBase64)
        );

        console.log("Decoded staff token payload:", decodedPayload);

        const roleName: string = decodedPayload?.role?.name;

        if (!roleName) {
          console.warn("No role name in token, redirecting to /dashboard/staff");
          router.push("/dashboard/staff");
          return;
        }

        // Format role name (e.g., "HR Executive" → "hr-executive")
        const formattedRole = roleName.toLowerCase().replace(/\s+/g, "-");

        console.log(`Redirecting based on role: ${roleName} -> ${formattedRole}`);

        switch (formattedRole) {
          case "department-manager":
            router.push("/dashboard/department-manager");
            break;
          case "hr-executive":
            router.push("/dashboard/hr-executive");
            break;
          case "finance-officer":
            router.push("/dashboard/finance-officer");
            break;
          case "it-support":
            router.push("/dashboard/it-support");
            break;
          case "operations-supervisor":
            router.push("/dashboard/operations-supervisor");
            break;
          case "gnd-user":
            router.push("/dashboard/gnd-user");
            break;
          default:
            router.push("/dashboard/staff");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error.message);
      alert(error.message || "Login failed");
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
                  <Input id="username" name="username" placeholder="nimal" type="text" onChange={(e) => setUsername(e.target.value)} />
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
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
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
