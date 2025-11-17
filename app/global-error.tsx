"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background text-foreground">
          <div className="w-full max-w-2xl text-center space-y-6">
            {/* Error Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center shadow-lg">
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
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Critical Error
            </h1>
            
            <p className="text-lg text-muted-foreground">
              A critical error has occurred in the application.
            </p>
            
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/50 border-2 border-red-200 dark:border-red-800 max-w-xl mx-auto">
              <p className="text-sm text-red-600 dark:text-red-400 font-mono break-all">
                {error.message || "An unexpected critical error occurred"}
              </p>
              {error.digest && (
                <p className="text-xs text-red-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={reset}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg transition-colors"
              >
                Try Again
              </button>
              
              <a
                href="/"
                className="px-6 py-3 rounded-lg border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 font-medium transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

