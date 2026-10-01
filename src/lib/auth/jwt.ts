import { SignJWT, jwtVerify } from "jose";

export type UserRole = "PASSENGER" | "CONTROLLER" | "STATION_MASTER" | "MLOPS";

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  stationOrZone: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "railvista-sih-2026-secret-key-cris-indian-railways-0f3875"
);

export async function signJwtToken(payload: Omit<JwtPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .setIssuer("railvista.cris.org.in")
    .setAudience("railvista-app")
    .sign(JWT_SECRET);
}

export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: "railvista.cris.org.in",
      audience: "railvista-app",
    });

    return {
      sub: payload.sub as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      designation: payload.designation as string,
      stationOrZone: payload.stationOrZone as string,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    return null;
  }
}

export function extractTokenFromHeaderOrCookie(req: Request): string | null {
  // 1. Check Authorization Bearer header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.substring(7).trim();
  }

  // 2. Check Cookie header
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith("railvista_token=")) {
        return cookie.substring("railvista_token=".length).trim();
      }
    }
  }

  return null;
}
