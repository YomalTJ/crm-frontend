/* eslint-disable @typescript-eslint/no-explicit-any */
interface LoginPayload {
  username: string;
  password: string;
}

export const loginUser = async ({ username, password }: LoginPayload) => {
  try {
    const res = await fetch("/api/auth/staff-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) return {
      type: "staff",
      success: data.success,
      roleName: data.roleName,
      locationDetails: data.locationDetails
    };

    throw new Error(data.error || "Login failed");
  } catch (err: any) {
    throw new Error(err.message || "Something went wrong");
  }
};

export const logoutUser = async () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('staffLocation');
    }

    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: 'include',
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Logout failed");
    }

    return true;
  } catch (err: any) {
    console.error("Logout error:", err.message);
    return false;
  }
};