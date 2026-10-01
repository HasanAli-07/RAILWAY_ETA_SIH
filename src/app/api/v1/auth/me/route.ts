import { NextResponse } from "next/server";
import { verifyJwtToken, extractTokenFromHeaderOrCookie } from "@/lib/auth/jwt";
import { PRESET_USERS } from "@/lib/auth/AuthContext";

export async function GET(request: Request) {
  const token = extractTokenFromHeaderOrCookie(request);

  if (!token) {
    return NextResponse.json({
      authenticated: false,
      user: PRESET_USERS.PASSENGER, // Default guest view
      token: null,
    });
  }

  const payload = await verifyJwtToken(token);

  if (!payload) {
    return NextResponse.json(
      {
        authenticated: false,
        error: "Invalid or expired JWT bearer token",
        user: PRESET_USERS.PASSENGER,
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      designation: payload.designation,
      stationOrZone: payload.stationOrZone,
    },
    expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
  });
}
