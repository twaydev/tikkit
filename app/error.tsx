"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 relative overflow-hidden">
      {/* Technical dot grid background */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(147, 51, 234, 0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>
      
      {/* Background decorative elements */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-300 dark:bg-red-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-orange-300 dark:bg-orange-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-2xl relative z-10">
        <Card className="border-2 border-red-200 dark:border-red-800 shadow-2xl">
          <CardHeader className="text-center">
            {/* Error Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-red-500/50 dark:shadow-red-500/30 animate-float">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" x2="12" y1="8" y2="12"/>
                  <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
              </div>
            </div>
            
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
              Something Went Wrong
            </CardTitle>
            <CardDescription className="text-lg">
              We encountered an unexpected error
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 font-mono break-all">
                {error.message || "An unexpected error occurred"}
              </p>
              {error.digest && (
                <p className="text-xs text-red-500 dark:text-red-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            
            <p className="text-center text-muted-foreground">
              Don't worry, this happens sometimes. You can try reloading the page or go back to the homepage.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                onClick={reset}
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                </svg>
                Try Again
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50"
              >
                <Link href="/" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Go Home
                </Link>
              </Button>
            </div>
            
            {/* Help Text */}
            <div className="pt-6 border-t border-red-200 dark:border-red-800">
              <p className="text-sm text-center text-muted-foreground">
                If this problem persists, please contact our support team with the error ID above.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

