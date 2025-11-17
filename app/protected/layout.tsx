import { Sidebar } from "@/components/sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 relative">
        {/* Background dot pattern */}
        <div className="fixed inset-0 z-0 lg:left-64" style={{
          backgroundImage: 'radial-gradient(circle, rgba(147, 51, 234, 0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>
        
        <main className="flex-1 p-6 relative z-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full flex items-center justify-center border-t border-purple-200 dark:border-purple-800 mx-auto text-center text-xs gap-8 py-8 px-6">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Tikkit. Built for solo entrepreneurs.
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </div>
  );
}
