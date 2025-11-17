import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 relative overflow-hidden">
      {/* Technical dot grid background */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(147, 51, 234, 0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>
      
      {/* Background decorative elements */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-orange-300 dark:bg-orange-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-2xl relative z-10">
        <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-2xl">
          <CardHeader className="text-center">
            {/* 404 Icon */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30">
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
                  <path d="m15 9-6 6"/>
                  <path d="m9 9 6 6"/>
                </svg>
              </div>
            </div>
            
            {/* 404 Number */}
            <div className="mb-4">
              <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                404
              </h1>
            </div>
            
            <CardTitle className="text-3xl md:text-4xl font-bold mb-2">
              Page Not Found
            </CardTitle>
            <CardDescription className="text-lg">
              Oops! The page you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              The page you are trying to access might have been moved, deleted, or never existed in the first place.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30"
              >
                <Link href="/" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Go Home
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50"
              >
                <Link href="/protected" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect width="7" height="9" x="3" y="3" rx="1"/>
                    <rect width="7" height="5" x="14" y="3" rx="1"/>
                    <rect width="7" height="9" x="14" y="12" rx="1"/>
                    <rect width="7" height="5" x="3" y="16" rx="1"/>
                  </svg>
                  Dashboard
                </Link>
              </Button>
            </div>
            
            {/* Help Text */}
            <div className="pt-6 border-t border-purple-200 dark:border-purple-800">
              <p className="text-sm text-center text-muted-foreground">
                Need help? Contact support or check our documentation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

