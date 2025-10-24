/* eslint-disable @typescript-eslint/no-explicit-any */
interface LoginPayload {
  username: string;
  password: string;
}

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000;

export const loginUser = async ({ username, password }: LoginPayload) => {
  // Basic client-side rate limiting
  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    throw new Error('Please wait before trying again');
  }
  lastRequestTime = now;

  try {
    const res = await fetch("/api/auth/staff-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-key": process.env.APP_AUTH_KEY!
      },
      body: JSON.stringify({ username, password })
    });

    // Handle rate limit responses
    if (res.status === 429) {
      throw new Error('Too many login attempts. Please wait a few minutes and try again.');
    }

    // Handle server errors
    if (res.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    const data = await res.json();

    if (res.ok) return {
      type: "staff",
      success: data.success,
      roleName: data.roleName,
      locationDetails: data.locationDetails,
      wbbPassword: data.wbbPassword,
      nic: data.nic,
      staffAccessToken: data.staffAccessToken // Add token to response
    };

    // Handle specific error messages from server
    const errorMessage = data.error || data.message || "Login failed. Please check your credentials.";
    throw new Error(errorMessage);
  } catch (err: any) {
    // Handle network errors
    if (err.name === 'TypeError' || err.message.includes('Network') || err.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw new Error(err.message || "Something went wrong. Please try again.");
  }
};

export const logoutUser = async () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('staffLocation');
      sessionStorage.removeItem('userNIC');
    }

    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-app-key': process.env.APP_AUTH_KEY!
      }
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


