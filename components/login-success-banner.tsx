"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export function LoginSuccessBanner() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (message === "login_success") {
      setShowSuccess(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!showSuccess) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg flex items-center gap-3 min-w-[300px]">
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
        <p className="text-sm font-medium text-green-800 dark:text-green-200">
          You have been logged in successfully
        </p>
      </div>
    </div>
  );
}

