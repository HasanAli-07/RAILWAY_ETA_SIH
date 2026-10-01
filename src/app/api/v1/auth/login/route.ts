import { NextResponse } from "next/server";
import { signJwtToken } from "@/lib/auth/jwt";
import { PRESET_USERS, UserRole } from "@/lib/auth/AuthContext";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role: UserRole = body.role || "PASSENGER";

    const user = PRESET_USERS[role] || PRESET_USERS.PASSENGER;

    // Issue signed JWT token
    const token = await signJwtToken({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation,
      stationOrZone: user.stationOrZone,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user,
      message: `Authenticated as ${user.name} (${user.role}) via JWT HS256 token`,
    });

    // Set HTTP-Only Cookie
    response.cookies.set({
      name: "railvista_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to authenticate" },
      { status: 400 }
    );
  }
}
