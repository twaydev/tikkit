import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Sparkles, BookOpen, DollarSign, Book, Mail } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
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
      <nav className="w-full flex justify-center border-b-2 border-purple-200 dark:border-purple-800 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 shadow-sm">
        <div className="w-full max-w-7xl flex justify-between items-center p-4 px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-purple-500/30 transition-transform group-hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Tikkit
            </span>
          </Link>
          
          {/* Navigation Links - Hidden on mobile, shown on md+ */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="#features" 
              className="group flex items-center gap-2 text-base font-semibold text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-105 relative"
            >
              <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-purple-500" />
              <span className="relative">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
            <Link 
              href="https://tway.dev/posts/" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-base font-semibold text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-105 relative"
            >
              <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-purple-500" />
              <span className="relative">
                Blog
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
            <Link 
              href="#pricing" 
              className="group flex items-center gap-2 text-base font-semibold text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-105 relative"
            >
              <DollarSign className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-purple-500" />
              <span className="relative">
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
            <Link 
              href="http://tikkit.tway.dev/docs" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-base font-semibold text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-105 relative"
            >
              <Book className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-purple-500" />
              <span className="relative">
                Docs
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
            <Link 
              href="#contact" 
              className="group flex items-center gap-2 text-base font-semibold text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-105 relative"
            >
              <Mail className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-purple-500" />
              <span className="relative">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            {user ? (
              <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/protected">Go to App</Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/auth/sign-up">Get started Free</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-7xl px-6 py-20 md:py-32">
          <Hero />
        </section>

        {/* Features Section */}
        <section id="features" className="w-full max-w-7xl px-6 py-20">
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

        {/* Pricing Section */}
        <section id="pricing" className="w-full max-w-7xl px-6 py-20">
          <div className="flex flex-col gap-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that fits your needs. All plans include our core features.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:shadow-xl hover:-translate-y-1 relative">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">Free</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription className="mt-4">Perfect for getting started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">Up to 50 tickets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">Basic organization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">Email support</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/auth/sign-up">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan - Featured */}
              <Card className="border-2 border-purple-500 dark:border-purple-400 hover:border-purple-600 dark:hover:border-purple-300 transition-all hover:shadow-xl hover:-translate-y-1 relative scale-105 md:scale-100">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">Pro</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">$9</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription className="mt-4">For serious solo entrepreneurs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">Unlimited tickets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">Advanced organization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">Priority support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">File attachments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">Export & backup</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Link href="/auth/sign-up">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:shadow-xl hover:-translate-y-1 relative">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">Enterprise</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                  <CardDescription className="mt-4">For custom needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">Everything in Pro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">Custom integrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">Dedicated support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">SLA guarantee</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm">Custom features</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="#contact">Contact Sales</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full max-w-7xl px-6 py-20">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild size="lg" variant="outline" className="text-base px-8 py-6 border-2 border-purple-200 dark:border-purple-800">
                <a href="mailto:contact@tway.dev" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email Us
                </a>
              </Button>
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
