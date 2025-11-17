"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Monitor, Smartphone, Tablet, Globe, LogOut, AlertCircle, CheckCircle2 } from "lucide-react";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export function ActiveSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Get current session info
      const { data: { session } } = await supabase.auth.getSession();
      
      // Since Supabase doesn't provide a direct API to list all sessions,
      // we'll show the current session and provide option to sign out from other devices
      const currentSession: Session = {
        id: session?.access_token || "current",
        device: getDeviceType(),
        browser: getBrowser(),
        location: "Current location",
        lastActive: "Now",
        isCurrent: true,
      };

      setSessions([currentSession]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceType = (): string => {
    if (typeof window === "undefined") return "Unknown";
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return "Mobile";
    return "Desktop";
  };

  const getBrowser = (): string => {
    if (typeof window === "undefined") return "Unknown";
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Unknown Browser";
  };

  const handleSignOutOtherDevices = async () => {
    if (!confirm("Are you sure you want to sign out from all other devices? You'll need to sign in again on those devices.")) {
      return;
    }

    const supabase = createClient();
    setSigningOut("all");
    setError(null);

    try {
      // Note: Supabase doesn't have a direct API to sign out from other devices
      // The recommended approach is to use Row Level Security (RLS) policies
      // or implement a custom session management system
      // For now, we'll show a message that this feature requires backend implementation
      
      // Alternative: You can invalidate all sessions by changing the user's password
      // but that's not ideal. A better approach would be to track sessions in a database
      // and invalidate them server-side.
      
      setError("This feature requires backend implementation. Please contact support or implement a session management system.");
      
      // In a production environment, you would:
      // 1. Track sessions in a database table
      // 2. Call a server action/API route to invalidate other sessions
      // 3. Use Supabase RLS policies to enforce session validity
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign out from other devices");
    } finally {
      setSigningOut(null);
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return <Smartphone className="w-5 h-5" />;
      case "tablet":
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Active Sessions
          </CardTitle>
          <CardDescription>Loading sessions...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Active Sessions
        </CardTitle>
        <CardDescription>
          Manage your active sessions across different devices. Sign out from devices you no longer use.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="p-4 rounded-lg bg-muted border border-purple-200 dark:border-purple-800 text-center">
              <p className="text-sm text-muted-foreground">No active sessions found.</p>
            </div>
          ) : (
            <>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white">
                      {getDeviceIcon(session.device)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{session.device}</p>
                        {session.isCurrent && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{session.browser}</p>
                      <p className="text-xs text-muted-foreground">{session.location} • {session.lastActive}</p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Handle individual session sign out
                      }}
                      className="border-purple-200 dark:border-purple-800"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  )}
                </div>
              ))}

              {/* Sign Out from Other Devices */}
              <div className="pt-4 border-t border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-50/50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                      Sign Out from Other Devices
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                      This will sign you out from all devices except this one. You'll need to sign in again on other devices.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOutOtherDevices}
                      disabled={signingOut === "all"}
                      className="mt-3 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-950/50"
                    >
                      {signingOut === "all" ? (
                        "Signing Out..."
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out from All Other Devices
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

