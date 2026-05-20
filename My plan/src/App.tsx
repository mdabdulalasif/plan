/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { UserSession } from "./types";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user session already exists in standard local storage
    const storedSession = localStorage.getItem("sphere_current_session");
    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession));
      } catch (err) {
        console.error("Invalid token, clearing session state", err);
        localStorage.removeItem("sphere_current_session");
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
  };

  const handleLogout = () => {
    localStorage.removeItem("sphere_current_session");
    setSession(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-mono text-xs text-indigo-400">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Synchronizing Sphere Node...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {session ? (
        <Dashboard session={session} onLogout={handleLogout} />
      ) : (
        <Auth onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}
