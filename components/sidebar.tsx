"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Home, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const navigation = [
  { name: "Dashboard", href: "/protected", icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email || null);
    });
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-purple-200 dark:border-purple-800 bg-gradient-to-b from-purple-50/50 via-pink-50/30 to-background dark:from-purple-950/30 dark:via-pink-950/20 dark:to-background transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center border-b border-purple-200 dark:border-purple-800 px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold group"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">Tikkit</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 text-purple-700 dark:text-purple-300 shadow-sm border border-purple-200 dark:border-purple-800"
                      : "text-muted-foreground hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 dark:hover:text-purple-400"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer with User Info */}
          <div className="border-t border-purple-200 dark:border-purple-800 p-4 space-y-3">
            {userEmail && (
              <div className="px-3 py-2 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200 dark:border-purple-800">
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">Signed in as</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 truncate font-medium">{userEmail}</p>
              </div>
            )}
            <div className="px-3">
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

