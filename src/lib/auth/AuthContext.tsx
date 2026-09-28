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
  isAuthenticated: boolean;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: PRESET_USERS.PASSENGER,
  isAuthenticated: true,
  loginAsRole: () => {},
  logout: () => {},
  showLoginModal: false,
  setShowLoginModal: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(PRESET_USERS.PASSENGER);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  useEffect(() => {
    // Load persisted session
    const saved = localStorage.getItem("dtape_user_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role) {
          setUser(parsed);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const loginAsRole = (role: UserRole) => {
    const session = PRESET_USERS[role];
    setUser(session);
    localStorage.setItem("dtape_user_session", JSON.stringify(session));
    setShowLoginModal(false);
  };

  const logout = () => {
    setUser(PRESET_USERS.PASSENGER); // Reset to public passenger view
    localStorage.removeItem("dtape_user_session");
    setShowLoginModal(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
