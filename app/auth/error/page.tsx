import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication Error",
  description: "An error occurred during authentication. Please try again or contact support if the problem persists.",
  robots: {
    index: false,
    follow: false,
  },
};

function getErrorDetails(errorType?: string) {
  switch (errorType) {
    case "expired_link":
      return {
        title: "Magic Link Expired",
        description: "This magic link has expired. Links are valid for 1 hour.",
        action: "/auth/magic-link",
        actionText: "Request New Link",
        showMagicLinkButton: true,
      };
    case "used_link":
      return {
        title: "Magic Link Already Used",
        description: "This magic link has already been used. Each link can only be used once.",
        action: "/auth/magic-link",
        actionText: "Request New Link",
        showMagicLinkButton: true,
      };
    case "invalid_request":
      return {
        title: "Invalid Request",
        description: "The authentication link is invalid or malformed.",
        action: "/auth/login",
        actionText: "Back to Login",
        showMagicLinkButton: false,
      };
    default:
      return {
        title: "Authentication Error",
        description: errorType || "An error occurred during authentication.",
        action: "/auth/login",
        actionText: "Back to Login",
        showMagicLinkButton: false,
      };
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorDetails = getErrorDetails(params?.error);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative overflow-hidden">
      {/* Technical dot grid background */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(147, 51, 234, 0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>
      
      {/* Background decorative elements */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-red-300 dark:bg-red-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-orange-300 dark:bg-orange-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Tikkit
          </span>
        </Link>
        
        <Card className="border-2 border-red-200 dark:border-red-800 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-center text-red-600 dark:text-red-400">
              {errorDetails.title}
            </CardTitle>
            <CardDescription className="text-center">
              {errorDetails.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30"
            >
              <Link href={errorDetails.action}>
                {errorDetails.showMagicLinkButton && <Mail className="mr-2 h-4 w-4" />}
                {errorDetails.actionText}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-purple-200 dark:border-purple-800">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
