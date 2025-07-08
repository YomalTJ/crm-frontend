interface LoginPayload {
  username: string;
  password: string;
}

export const loginUser = async ({ username, password }: LoginPayload) => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  } catch (err: any) {
    throw new Error(err.message || "Something went wrong");
  }
};

