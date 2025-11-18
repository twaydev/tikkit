import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon, Sparkles, Zap, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginSuccessBanner } from "@/components/login-success-banner";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your tickets and track your progress. View your active tickets, completed tasks, and account statistics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Success Message Banner */}
      <Suspense fallback={null}>
        <LoginSuccessBanner />
      </Suspense>
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950 border-2 border-purple-200 dark:border-purple-800 p-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Welcome to Tikkit Dashboard!
            </h1>
            <p className="text-muted-foreground">You're all set up and ready to manage your tickets.</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white mb-2">
              <Target className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg">Active Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">0</p>
            <CardDescription className="mt-1">No active tickets yet</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">0</p>
            <CardDescription className="mt-1">Great start!</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-orange-950/30 dark:to-yellow-950/30">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center text-white mb-2">
              <InfoIcon className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">0</p>
            <CardDescription className="mt-1">Time to create your first</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* User Details */}
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Your Account Details</CardTitle>
          <CardDescription>Your authenticated user information</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono p-4 rounded-lg bg-muted border max-h-48 overflow-auto">
            {JSON.stringify(data.claims, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
