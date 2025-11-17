"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button 
      onClick={logout} 
      variant="outline"
      className="w-full border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
