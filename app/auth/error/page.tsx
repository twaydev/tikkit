import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

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
        
        <div className="flex flex-col gap-6">
          <Card className="border-2 border-red-200 dark:border-red-800 shadow-lg">
            <CardHeader>
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center text-white mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" x2="12" y1="8" y2="12"/>
                  <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent text-center">
                Sorry, something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Error: {params.error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground text-center mb-4">
                  An unspecified error occurred.
                </p>
              )}
              <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30">
                <Link href="/auth/login">
                  Back to Login
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
