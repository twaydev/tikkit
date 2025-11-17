import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  // Get user metadata
  const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name || "";
  const email = user.email || "";
  const emailVerified = user.email_confirmed_at !== null;
  const userId = user.id;
  const avatarUrl = user.user_metadata?.avatar_url || null;

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950 border-2 border-purple-200 dark:border-purple-800 p-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-muted-foreground">Manage your account preferences and security settings.</p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <SettingsTabs 
        initialDisplayName={displayName}
        email={email}
        emailVerified={emailVerified}
        userId={userId}
        initialAvatarUrl={avatarUrl}
      />
    </div>
  );
}

