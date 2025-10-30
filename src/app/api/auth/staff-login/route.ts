/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    const res = await axiosInstance.post("/staff/login", {
      username,
      password,
    }, { withCredentials: true });

    const staffToken = res.data.staffAccessToken;
    const locationDetails = res.data.locationDetails;
    const wbbPassword = res.data.wbbPassword;
    const nic = res.data.nic;

    // Decode role from JWT payload
    const decoded: any = JSON.parse(
      Buffer.from(staffToken.split(".")[1], "base64").toString()
    );

    const roleName = decoded?.roleName || "staff";

    // (await cookies()).set("staffAccessToken", staffToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 60 * 60 * 24 * 7,
    //   path: "/",
    //   sameSite: "lax",
    // });

    (await cookies()).set("staffAccessToken", staffToken, {
      httpOnly: true,
      secure: false, // explicitly off
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });


    return NextResponse.json({
      success: true,
      roleName,
      type: "staff",
      locationDetails,
      wbbPassword,
      nic,
      staffAccessToken: staffToken
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.data?.message || "Staff login failed" },
      { status: 401 }
    );
  }
}
