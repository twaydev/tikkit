"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "./general-settings";
import { AuthenticationSettings } from "./authentication-settings";
import { User, Lock } from "lucide-react";

interface SettingsTabsProps {
  initialDisplayName: string;
  email: string;
  emailVerified: boolean;
  userId: string;
  initialAvatarUrl?: string | null;
}

export function SettingsTabs({ initialDisplayName, email, emailVerified, userId, initialAvatarUrl }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex gap-6 w-full">
        <TabsList className="flex flex-col h-fit w-64 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-2">
          <TabsTrigger 
            value="general" 
            className="w-full justify-start data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-100 data-[state=active]:to-pink-100 data-[state=active]:dark:from-purple-950 data-[state=active]:dark:to-pink-950 data-[state=active]:text-purple-700 data-[state=active]:dark:text-purple-300"
          >
            <User className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger 
            value="authentication"
            className="w-full justify-start data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-100 data-[state=active]:to-pink-100 data-[state=active]:dark:from-purple-950 data-[state=active]:dark:to-pink-950 data-[state=active]:text-purple-700 data-[state=active]:dark:text-purple-300"
          >
            <Lock className="w-4 h-4 mr-2" />
            Authentication
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="general" className="mt-0">
            <GeneralSettings initialDisplayName={initialDisplayName} email={email} userId={userId} initialAvatarUrl={initialAvatarUrl} />
          </TabsContent>

          <TabsContent value="authentication" className="mt-0">
            <AuthenticationSettings email={email} emailVerified={emailVerified} />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}

