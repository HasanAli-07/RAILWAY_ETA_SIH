"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ConsoleMode } from "@/components/layout/HeaderNav";

export type UserRole = "PASSENGER" | "CONTROLLER" | "STATION_MASTER" | "MLOPS";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  stationOrZone: string;
  avatarUrl?: string;
}

export const PRESET_USERS: Record<UserRole, UserSession> = {
  PASSENGER: {
    id: "u-passenger",
    name: "Passenger Portal",
    email: "public.passenger@irctc.co.in",
    role: "PASSENGER",
    designation: "Rail Passenger / Traveler",
    stationOrZone: "Public Access",
  },
  CONTROLLER: {
    id: "u-controller",
    name: "Sh. R. K. Sharma",
    email: "controller.delhi@railways.gov.in",
    role: "CONTROLLER",
    designation: "Section Train Controller",
    stationOrZone: "Delhi Division (NR)",
  },
  STATION_MASTER: {
    id: "u-stationmaster",
    name: "Sh. V. K. Yadav",
    email: "stationmaster.cnb@railways.gov.in",
    role: "STATION_MASTER",
    designation: "Station Master",
    stationOrZone: "Kanpur Central (CNB)",
  },
  MLOPS: {
    id: "u-mlops",
    name: "Dr. A. K. Roy",
    email: "mlops.lead@cris.org.in",
    role: "MLOPS",
    designation: "Lead Systems Architect",
    stationOrZone: "CRIS HQ (New Delhi)",
  },
};

interface AuthContextType {
  user: UserSession | null;
  jwtToken: string | null;
  isAuthenticated: boolean;
  loginAsRole: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: PRESET_USERS.PASSENGER,
  jwtToken: null,
  isAuthenticated: true,
  loginAsRole: async () => {},
  logout: async () => {},
  showLoginModal: false,
  setShowLoginModal: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(PRESET_USERS.PASSENGER);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  useEffect(() => {
    // Check session status on mount via JWT auth/me route
    const initAuth = async () => {
      try {
        const res = await fetch("/api/v1/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch (e) {
        // Fallback to local storage
        const savedToken = localStorage.getItem("railvista_jwt_token");
        const savedUser = localStorage.getItem("railvista_user_session");
        if (savedToken && savedUser) {
          try {
            setJwtToken(savedToken);
            setUser(JSON.parse(savedUser));
          } catch (err) {}
        }
      }
    };

    initAuth();
  }, []);

  const loginAsRole = async (role: UserRole) => {
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setJwtToken(data.token);
          localStorage.setItem("railvista_jwt_token", data.token);
          localStorage.setItem("railvista_user_session", JSON.stringify(data.user));
          setShowLoginModal(false);
          return;
        }
      }
    } catch (e) {
      console.warn("JWT Login endpoint offline, using local session state", e);
    }

    // Fallback local session state
    const session = PRESET_USERS[role];
    setUser(session);
    localStorage.setItem("railvista_user_session", JSON.stringify(session));
    setShowLoginModal(false);
  };

  const logout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch (e) {}

    setUser(PRESET_USERS.PASSENGER); // Reset to public passenger view
    setJwtToken(null);
    localStorage.removeItem("railvista_jwt_token");
    localStorage.removeItem("railvista_user_session");
    setShowLoginModal(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        jwtToken,
        isAuthenticated: !!user,
        loginAsRole,
        logout,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
