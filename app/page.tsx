import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const features = [
    {
      title: "Lightning Fast",
      description: "Get started in seconds. No complex setup, no overwhelming features. Just what you need.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      gradient: "from-yellow-400 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950",
    },
    {
      title: "Built for Solo",
      description: "Designed specifically for solo entrepreneurs. No team features you'll never use.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      gradient: "from-purple-400 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
    },
    {
      title: "Stay Organized",
      description: "Keep track of everything in one place. Simple categories, clear priorities.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
      gradient: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
    },
    {
      title: "Privacy First",
      description: "Your data stays yours. No tracking, no ads, no nonsense.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      gradient: "from-green-400 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="w-full max-w-7xl flex justify-between items-center p-4 px-6">
          <Link href="/" className="text-xl font-bold">
            Tikkit
          </Link>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-7xl px-6 py-20 md:py-32">
          <Hero />
        </section>

        {/* Features Section */}
        <section className="w-full max-w-7xl px-6 py-20">
          <div className="flex flex-col gap-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Everything you need, nothing you don't</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built with solo entrepreneurs in mind. Simple, focused, and powerful.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className={`border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${feature.bgGradient}`}>
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg flex items-center justify-center text-white mb-4 transition-transform hover:scale-110 hover:rotate-3`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-7xl px-6 py-20">
          <div className="relative rounded-2xl border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950 p-12 text-center space-y-6 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full filter blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">Ready to get organized?</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4">
                Join solo entrepreneurs who are staying on top of their work with Tikkit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="text-base px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30 group">
                  <Link href="/auth/sign-up" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <line x1="19" x2="19" y1="8" y2="14"/>
                      <line x1="22" x2="16" y1="11" y2="11"/>
                    </svg>
                    Start Free Today
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base px-8 py-6 border-2 border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-black/50 backdrop-blur hover:bg-purple-50 dark:hover:bg-purple-950/70">
                  <Link href="/auth/login" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" x2="3" y1="12" y2="12"/>
                    </svg>
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="w-full flex items-center justify-center border-t border-t-foreground/10 py-8 mt-auto">
        <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center px-6 gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Tikkit. Built for solo entrepreneurs.</p>
          <div className="flex gap-6">
            <Link href="/auth/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
