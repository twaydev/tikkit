# Magic Link Authentication Implementation Plan

## Overview
This document outlines the complete implementation plan for passwordless magic link authentication for Tikkit. Magic links provide a secure, user-friendly way to authenticate without remembering passwords.

## Current Status
❌ **Not yet implemented** - Planning phase

## Feature Summary
Based on `tests/features/magiclink.feature`, the implementation covers:
- Passwordless authentication via email links
- One-time use tokens with 1-hour expiration
- Automatic account creation for new users
- Integration with existing 2FA/MFA
- Rate limiting and security measures
- Cross-platform support (web, mobile deep linking)
- Session management and audit logging

---

## Architecture Overview

### Flow Diagram
```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   User      │────▶│  Send Magic  │────▶│   Supabase   │
│   Enters    │     │  Link Request│     │   Auth API   │
│   Email     │     └──────────────┘     └──────────────┘
└─────────────┘              │                    │
                             │                    ▼
                             │            ┌──────────────┐
                             │            │ Generate OTP │
                             │            │ token_hash   │
                             │            └──────────────┘
                             │                    │
                             ▼                    ▼
                    ┌──────────────┐     ┌──────────────┐
                    │  Show Success│     │ Send Email   │
                    │  Message     │     │ with Link    │
                    └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
                    ┌──────────────────────────────────┐
                    │   User clicks link in email      │
                    └──────────────────────────────────┘
                             │
                             ▼
                    ┌──────────────┐
                    │ Verify OTP   │
                    │ /auth/confirm│
                    └──────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
            ✓ Valid                   ✗ Invalid
                │                         │
                ▼                         ▼
        ┌──────────────┐         ┌──────────────┐
        │ Create Session│        │ Show Error   │
        │ Redirect to   │        │ Offer Retry  │
        │ Dashboard     │        └──────────────┘
        └──────────────┘
```

---

## Phase 1: Basic Magic Link Implementation

### 1.1 Frontend Components

#### Create Magic Link Request Page
**File**: `app/auth/magic-link/page.tsx`

```typescript
import type { Metadata } from "next";
import { MagicLinkForm } from "@/components/magic-link-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Magic Link Login",
  description: "Sign in to your Tikkit account with a magic link sent to your email.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MagicLinkPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative overflow-hidden">
      {/* Background styling similar to login page */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(147, 51, 234, 0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>
      
      <div className="w-full max-w-sm relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          {/* Logo component */}
        </Link>
        <MagicLinkForm />
      </div>
    </div>
  );
}
```

#### Create Magic Link Form Component
**File**: `components/magic-link-form.tsx`

```typescript
"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export function MagicLinkForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      
      if (error) throw error;
      
      setEmailSent(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
              Check your email
            </CardTitle>
            <CardDescription className="text-center">
              We sent a magic link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Click the link in the email to sign in. The link will expire in 1 hour.
                </p>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>Didn't receive the email?</p>
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Try again
                </button>
              </div>
              <Link href="/auth/login" className="flex items-center justify-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
            Login with Magic Link
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a magic link to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendMagicLink}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600"
                />
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30" 
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Magic Link"}
              </Button>
            </div>
            
            <div className="mt-4 text-center text-sm">
              <Link
                href="/auth/login"
                className="text-purple-600 dark:text-purple-400 font-medium underline underline-offset-4 hover:text-purple-700 dark:hover:text-purple-300 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to password login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Update Login Form to Include Magic Link Option
**File**: `components/login-form.tsx` (modifications)

Add a button/link before the login button:

```typescript
// Add after the password input field, before the submit button
<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t border-purple-200 dark:border-purple-800" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-background px-2 text-muted-foreground">
      Or
    </span>
  </div>
</div>

<Button
  type="button"
  variant="outline"
  className="w-full border-purple-200 dark:border-purple-800"
  onClick={() => router.push("/auth/magic-link")}
>
  <Mail className="mr-2 h-4 w-4" />
  Login with Magic Link
</Button>
```

---

### 1.2 Backend Route Handlers

#### Confirm Route (Already Exists - Enhancement Needed)
**File**: `app/auth/confirm/route.ts`

The existing confirm route already handles magic links via `verifyOtp`. Enhancements needed:

```typescript
import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/protected";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    
    if (!error) {
      // Log successful magic link login
      // TODO: Add audit logging here
      console.log(`Magic link login successful for user: ${data?.user?.email}`);
      
      // Redirect user to dashboard with success message
      redirect(`${next}?message=login_success`);
    } else {
      // Handle specific error cases
      const errorMessage = encodeURIComponent(error.message);
      
      if (error.message.includes("expired")) {
        redirect(`/auth/error?error=expired_link&email=${searchParams.get("email")}`);
      } else if (error.message.includes("already been used")) {
        redirect(`/auth/error?error=used_link&email=${searchParams.get("email")}`);
      } else {
        redirect(`/auth/error?error=${errorMessage}`);
      }
    }
  }

  redirect(`/auth/error?error=invalid_request`);
}
```

#### Enhanced Error Page
**File**: `app/auth/error/page.tsx` (enhance existing)

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Mail } from "lucide-react";

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { error?: string; email?: string };
}) {
  const { error, email } = searchParams;
  
  const getErrorDetails = (errorType?: string) => {
    switch (errorType) {
      case "expired_link":
        return {
          title: "Magic Link Expired",
          description: "This magic link has expired. Links are valid for 1 hour.",
          action: email ? `/auth/magic-link?email=${email}` : "/auth/magic-link",
          actionText: "Request New Link",
        };
      case "used_link":
        return {
          title: "Magic Link Already Used",
          description: "This magic link has already been used. Each link can only be used once.",
          action: email ? `/auth/magic-link?email=${email}` : "/auth/magic-link",
          actionText: "Request New Link",
        };
      case "invalid_request":
        return {
          title: "Invalid Request",
          description: "The authentication link is invalid or malformed.",
          action: "/auth/login",
          actionText: "Back to Login",
        };
      default:
        return {
          title: "Authentication Error",
          description: error || "An error occurred during authentication.",
          action: "/auth/login",
          actionText: "Back to Login",
        };
    }
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
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
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Link href={errorDetails.action}>
                <Mail className="mr-2 h-4 w-4" />
                {errorDetails.actionText}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## Phase 2: Security & Rate Limiting

### 2.1 Supabase Configuration

#### Email Template Configuration
Configure in Supabase Dashboard (`Authentication > Email Templates > Magic Link`):

```html
<h2>Your Magic Link for Tikkit</h2>

<p>Hello,</p>

<p>You requested a magic link to sign in to your Tikkit account.</p>

<p>Click the button below to sign in:</p>

<table role="presentation" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #9333ea, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Sign In to Tikkit
      </a>
    </td>
  </tr>
</table>

<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p><strong>This link will expire in 1 hour.</strong></p>

<p><strong>Security Notice:</strong> If you didn't request this link, please ignore this email.</p>

<hr>

<p style="color: #666; font-size: 12px;">
  Need help? Contact support at support@tikkit.com
</p>
```

#### Rate Limiting in Supabase
Configure in `supabase/config.toml`:

```toml
[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = true
max_frequency = "5m"  # Limit to 1 email per 5 minutes per email address

[auth.rate_limit]
# Rate limit for magic link requests per IP
magic_link_requests_per_hour = 5
magic_link_requests_per_email_per_hour = 3
```

### 2.2 Client-Side Rate Limiting

#### Create Rate Limiter Utility
**File**: `lib/utils/rate-limiter.ts`

```typescript
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();

  check(key: string, config: RateLimitConfig): { 
    allowed: boolean; 
    retryAfter?: number;
    remainingAttempts: number;
  } {
    const now = Date.now();
    const entry = this.storage.get(key);

    // Clean up expired entries
    if (entry && now > entry.resetAt) {
      this.storage.delete(key);
    }

    const current = this.storage.get(key);

    if (!current) {
      this.storage.set(key, {
        count: 1,
        resetAt: now + config.windowMs,
      });
      return { 
        allowed: true, 
        remainingAttempts: config.maxAttempts - 1 
      };
    }

    if (current.count >= config.maxAttempts) {
      const retryAfter = Math.ceil((current.resetAt - now) / 1000);
      return { 
        allowed: false, 
        retryAfter,
        remainingAttempts: 0
      };
    }

    current.count++;
    return { 
      allowed: true,
      remainingAttempts: config.maxAttempts - current.count
    };
  }

  reset(key: string): void {
    this.storage.delete(key);
  }
}

export const magicLinkRateLimiter = new RateLimiter();

// Rate limit configs
export const MAGIC_LINK_RATE_LIMIT = {
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};
```

#### Update Magic Link Form with Rate Limiting
**File**: `components/magic-link-form.tsx` (enhancement)

```typescript
import { magicLinkRateLimiter, MAGIC_LINK_RATE_LIMIT } from "@/lib/utils/rate-limiter";

// Add to component state
const [rateLimitError, setRateLimitError] = useState<string | null>(null);

// Update handleSendMagicLink
const handleSendMagicLink = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Check rate limit
  const rateLimitKey = `magic-link:${email}`;
  const rateLimitResult = magicLinkRateLimiter.check(
    rateLimitKey,
    MAGIC_LINK_RATE_LIMIT
  );

  if (!rateLimitResult.allowed) {
    setRateLimitError(
      `Too many requests. Please try again in ${rateLimitResult.retryAfter} seconds.`
    );
    return;
  }

  const supabase = createClient();
  setIsLoading(true);
  setError(null);
  setRateLimitError(null);

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: {
          // Add metadata for tracking
          device: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      },
    });
    
    if (error) throw error;
    
    setEmailSent(true);
  } catch (error: unknown) {
    setError(error instanceof Error ? error.message : "An error occurred");
  } finally {
    setIsLoading(false);
  }
};

// Display rate limit error in UI
{rateLimitError && (
  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800">
    <p className="text-sm text-orange-600 dark:text-orange-400">{rateLimitError}</p>
  </div>
)}
```

---

## Phase 3: Security Enhancements

### 3.1 Audit Logging

#### Create Audit Log Utility
**File**: `lib/utils/audit-logger.ts`

```typescript
import { createClient } from "@/lib/supabase/server";

export interface AuditLogEntry {
  action: string;
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  user_agent?: string;
  status: "success" | "failure";
  error_message?: string;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent(entry: AuditLogEntry) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from("audit_logs").insert({
      ...entry,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Failed to log audit event:", error);
    }
  } catch (error) {
    console.error("Audit logging error:", error);
  }
}

// Specific audit log functions
export async function logMagicLinkRequest(
  email: string,
  ipAddress: string,
  userAgent: string
) {
  await logAuditEvent({
    action: "magic_link_request",
    user_email: email,
    ip_address: ipAddress,
    user_agent: userAgent,
    status: "success",
  });
}

export async function logMagicLinkLogin(
  userId: string,
  email: string,
  ipAddress: string,
  userAgent: string,
  success: boolean,
  errorMessage?: string
) {
  await logAuditEvent({
    action: "magic_link_login",
    user_id: userId,
    user_email: email,
    ip_address: ipAddress,
    user_agent: userAgent,
    status: success ? "success" : "failure",
    error_message: errorMessage,
  });
}
```

#### Create Audit Logs Table Migration
**File**: `supabase/migrations/YYYYMMDDHHMMSS_create_audit_logs.sql`

```sql
-- Create audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failure')),
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for common queries
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_user_email ON public.audit_logs(user_email);

-- Enable Row Level Security
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- System can insert audit logs (for service role)
CREATE POLICY "System can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.audit_logs IS 'Audit log for security and authentication events';
```

### 3.2 IP Address Tracking

#### Create IP Utility
**File**: `lib/utils/get-client-ip.ts`

```typescript
import { type NextRequest } from "next/server";

export function getClientIp(request: NextRequest): string {
  // Try various headers in order of preference
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return "unknown";
}

export function getUserAgent(request: NextRequest): string {
  return request.headers.get("user-agent") || "unknown";
}
```

#### Update Confirm Route with Audit Logging
**File**: `app/auth/confirm/route.ts` (enhancement)

```typescript
import { logMagicLinkLogin } from "@/lib/utils/audit-logger";
import { getClientIp, getUserAgent } from "@/lib/utils/get-client-ip";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/protected";
  
  const ipAddress = getClientIp(request);
  const userAgent = getUserAgent(request);

  if (token_hash && type) {
    const supabase = await createClient();

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    
    if (!error && data.user) {
      // Log successful login
      await logMagicLinkLogin(
        data.user.id,
        data.user.email!,
        ipAddress,
        userAgent,
        true
      );
      
      redirect(`${next}?message=login_success`);
    } else {
      // Log failed login
      if (data.user) {
        await logMagicLinkLogin(
          data.user.id,
          data.user.email!,
          ipAddress,
          userAgent,
          false,
          error?.message
        );
      }
      
      // Handle errors...
    }
  }

  redirect(`/auth/error?error=invalid_request`);
}
```

---

## Phase 4: User Experience Enhancements

### 4.1 Success Message Component

#### Create Toast/Alert Component for Success Messages
**File**: `components/ui/alert.tsx` (if not exists, use shadcn/ui)

```bash
npx shadcn-ui@latest add alert
```

#### Update Protected Page to Show Success Message
**File**: `app/protected/page.tsx` (enhancement)

```typescript
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export default function ProtectedPage() {
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

  return (
    <>
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              You have been logged in successfully
            </p>
          </div>
        </div>
      )}
      
      {/* Rest of protected page content */}
    </>
  );
}
```

### 4.2 Loading States

#### Create Loading Component
**File**: `components/ui/loading-spinner.tsx`

```typescript
export function LoadingSpinner({ 
  text = "Loading..." 
}: { 
  text?: string 
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
```

#### Create Magic Link Verification Page
**File**: `app/auth/verifying/page.tsx`

```typescript
"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Update page title
    document.title = "Logging you in...";
    
    // Simulate verification process
    // In reality, this happens in the confirm route
    const timer = setTimeout(() => {
      const next = searchParams.get("next") || "/protected";
      router.push(next);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoadingSpinner text="Logging you in..." />
      </div>
    </div>
  );
}
```

---

## Phase 5: Integration with Existing Features

### 5.1 Integration with 2FA/MFA

When a user has 2FA enabled and logs in via magic link, they should still be prompted for their 2FA code.

#### Create 2FA Challenge Page
**File**: `app/auth/mfa-challenge/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function MFAChallengePage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const factorId = searchParams.get("factor_id");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) {
      setError("Invalid MFA session");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Create challenge
      const { data: challengeData, error: challengeError } = 
        await supabase.auth.mfa.challenge({ factorId });

      if (challengeError) throw challengeError;

      // Verify code
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });

      if (verifyError) throw verifyError;

      // Success - redirect to dashboard
      router.push("/protected?message=login_success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-16 h-16 text-purple-600" />
            </div>
            <CardTitle className="text-2xl text-center">
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-center">
              Enter your authentication code to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Authentication Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

#### Update Confirm Route to Check for MFA
**File**: `app/auth/confirm/route.ts` (enhancement)

```typescript
export async function GET(request: NextRequest) {
  // ... existing code ...

  if (token_hash && type) {
    const supabase = await createClient();

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    
    if (!error && data.user) {
      // Check if user has MFA enabled
      const { data: factors } = await supabase.auth.mfa.listFactors();
      
      const activeFactor = factors?.totp?.find(f => f.status === "verified");
      
      if (activeFactor) {
        // Redirect to MFA challenge page
        redirect(`/auth/mfa-challenge?factor_id=${activeFactor.id}&next=${next}`);
      }
      
      // No MFA - proceed with login
      await logMagicLinkLogin(/*...*/);
      redirect(`${next}?message=login_success`);
    }
  }
}
```

### 5.2 Integration with RBAC

Magic link authentication should respect existing role-based access control.

#### Ensure Role Assignment on Account Creation
**File**: `supabase/migrations/YYYYMMDDHHMMSS_magic_link_user_roles.sql`

```sql
-- Function to assign default role to new users created via magic link
CREATE OR REPLACE FUNCTION public.handle_new_magic_link_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user was created via magic link (no password set)
  IF NEW.encrypted_password IS NULL THEN
    -- Assign default 'user' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_magic_link_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_magic_link_user();
```

### 5.3 Account Settings - Magic Link Preferences

#### Add Magic Link Settings to Account Settings
**File**: `components/settings/magic-link-settings.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, XCircle } from "lucide-react";

export function MagicLinkSettings() {
  const [isMagicLinkEnabled, setIsMagicLinkEnabled] = useState(true);
  const [isDefaultMethod, setIsDefaultMethod] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    // Load user preferences from database
    const { data } = await supabase
      .from("user_preferences")
      .select("magic_link_enabled, default_auth_method")
      .single();

    if (data) {
      setIsMagicLinkEnabled(data.magic_link_enabled ?? true);
      setIsDefaultMethod(data.default_auth_method === "magic_link");
    }
  }

  async function handleToggleMagicLink(enabled: boolean) {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          magic_link_enabled: enabled,
        });

      if (error) throw error;
      setIsMagicLinkEnabled(enabled);
    } catch (error) {
      console.error("Failed to update setting:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSetDefaultMethod(isDefault: boolean) {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          default_auth_method: isDefault ? "magic_link" : "password",
        });

      if (error) throw error;
      setIsDefaultMethod(isDefault);
    } catch (error) {
      console.error("Failed to update setting:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Magic Link Authentication
        </CardTitle>
        <CardDescription>
          Manage your passwordless login preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="enable-magic-link" className="text-base">
              Enable Magic Link
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow logging in with email links instead of passwords
            </p>
          </div>
          <Switch
            id="enable-magic-link"
            checked={isMagicLinkEnabled}
            onCheckedChange={handleToggleMagicLink}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="default-method" className="text-base">
              Use as Default Method
            </Label>
            <p className="text-sm text-muted-foreground">
              Show magic link option first on login page
            </p>
          </div>
          <Switch
            id="default-method"
            checked={isDefaultMethod}
            onCheckedChange={handleSetDefaultMethod}
            disabled={isLoading || !isMagicLinkEnabled}
          />
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Magic Link Status</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {isMagicLinkEnabled ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Magic link authentication is enabled</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Magic link authentication is disabled</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

#### Create User Preferences Table
**File**: `supabase/migrations/YYYYMMDDHHMMSS_user_preferences.sql`

```sql
-- Create user preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  magic_link_enabled BOOLEAN DEFAULT true,
  default_auth_method VARCHAR(20) DEFAULT 'password' CHECK (default_auth_method IN ('password', 'magic_link')),
  notification_on_login BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only view/update their own preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

---

## Phase 6: Mobile Deep Linking (Future Enhancement)

### 6.1 Universal Links Configuration

For iOS and Android apps, configure deep linking to handle magic links.

#### iOS Universal Links
**File**: `public/.well-known/apple-app-site-association`

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID.com.tikkit.app",
        "paths": [
          "/auth/confirm*",
          "/auth/magic-link*"
        ]
      }
    ]
  }
}
```

#### Android App Links
**File**: `public/.well-known/assetlinks.json`

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.tikkit.app",
      "sha256_cert_fingerprints": ["SHA256_FINGERPRINT_HERE"]
    }
  }
]
```

---

## Phase 7: Testing Strategy

### 7.1 BDD Test Implementation

#### Create Step Definitions
**File**: `tests/steps/magic-link.steps.ts`

```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

// Scenario 1: User requests magic link
Given("I am on the login page", async function () {
  await this.page.goto("/auth/login");
});

When('I click the "Login with Magic Link" button', async function () {
  await this.page.click('button:has-text("Login with Magic Link")');
});

Then("I should be taken to the magic link request page", async function () {
  await expect(this.page).toHaveURL(/.*magic-link/);
});

Then("I should see a form requesting my email address", async function () {
  await expect(this.page.locator('input[type="email"]')).toBeVisible();
});

Then('the form should have a "Send Magic Link" button', async function () {
  await expect(this.page.locator('button:has-text("Send Magic Link")')).toBeVisible();
});

// Scenario 2: User enters email
Given("I am on the magic link request page", async function () {
  await this.page.goto("/auth/magic-link");
});

When('I enter email {string}', async function (email: string) {
  await this.page.fill('input[type="email"]', email);
});

When('I click the "Send Magic Link" button', async function () {
  await this.page.click('button:has-text("Send Magic Link")');
});

Then('I should see the message {string}', async function (message: string) {
  await expect(this.page.locator(`text=${message}`)).toBeVisible();
});

Then("I should remain on the login page", async function () {
  await expect(this.page).toHaveURL(/.*magic-link/);
});

// Add more step definitions for other scenarios...
```

### 7.2 Unit Tests

#### Test Rate Limiter
**File**: `lib/utils/__tests__/rate-limiter.test.ts`

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { RateLimiter } from "../rate-limiter";

describe("RateLimiter", () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter();
  });

  it("should allow requests within limit", () => {
    const config = { maxAttempts: 3, windowMs: 60000 };
    
    const result1 = rateLimiter.check("test-key", config);
    expect(result1.allowed).toBe(true);
    expect(result1.remainingAttempts).toBe(2);

    const result2 = rateLimiter.check("test-key", config);
    expect(result2.allowed).toBe(true);
    expect(result2.remainingAttempts).toBe(1);
  });

  it("should block requests exceeding limit", () => {
    const config = { maxAttempts: 2, windowMs: 60000 };
    
    rateLimiter.check("test-key", config);
    rateLimiter.check("test-key", config);
    
    const result = rateLimiter.check("test-key", config);
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it("should reset after window expires", () => {
    const config = { maxAttempts: 1, windowMs: 100 };
    
    rateLimiter.check("test-key", config);
    const result1 = rateLimiter.check("test-key", config);
    expect(result1.allowed).toBe(false);

    // Wait for window to expire
    setTimeout(() => {
      const result2 = rateLimiter.check("test-key", config);
      expect(result2.allowed).toBe(true);
    }, 150);
  });
});
```

### 7.3 Integration Tests

#### Test Magic Link Flow
**File**: `tests/integration/magic-link.test.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Magic Link Authentication", () => {
  test("should send magic link and show success message", async ({ page }) => {
    await page.goto("/auth/magic-link");
    
    await page.fill('input[type="email"]', "test@example.com");
    await page.click('button:has-text("Send Magic Link")');
    
    await expect(page.locator("text=Check your email")).toBeVisible();
    await expect(page.locator("text=test@example.com")).toBeVisible();
  });

  test("should show rate limit error after too many requests", async ({ page }) => {
    await page.goto("/auth/magic-link");
    
    const email = "test@example.com";
    
    // Send multiple requests
    for (let i = 0; i < 4; i++) {
      await page.fill('input[type="email"]', email);
      await page.click('button:has-text("Send Magic Link")');
      await page.waitForTimeout(1000);
      
      if (i < 3) {
        await page.click('button:has-text("Try again")');
      }
    }
    
    await expect(page.locator("text=Too many requests")).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    await page.goto("/auth/magic-link");
    
    await page.fill('input[type="email"]', "invalid-email");
    await page.click('button:has-text("Send Magic Link")');
    
    // Browser validation or custom error
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute("aria-invalid", "true");
  });
});
```

---

## Phase 8: Deployment Checklist

### 8.1 Pre-Deployment

- [ ] Configure Supabase email templates
- [ ] Set up email rate limiting in Supabase dashboard
- [ ] Create audit_logs table migration
- [ ] Create user_preferences table migration
- [ ] Test magic link flow in staging environment
- [ ] Verify email delivery (check spam folders)
- [ ] Test rate limiting functionality
- [ ] Test integration with 2FA/MFA
- [ ] Test RBAC with magic link auth
- [ ] Verify audit logging works correctly

### 8.2 Deployment Steps

1. **Database Migrations**
   ```bash
   supabase migration up
   ```

2. **Deploy Frontend Changes**
   ```bash
   npm run build
   npm run deploy
   ```

3. **Configure Environment Variables**
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` is set
   - Ensure `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is set
   - Verify redirect URLs in Supabase dashboard

4. **Update Supabase Dashboard Settings**
   - Authentication > Email Templates > Magic Link
   - Authentication > URL Configuration > Redirect URLs
   - Add: `https://yourdomain.com/auth/confirm`
   - Add: `https://yourdomain.com/auth/magic-link`

### 8.3 Post-Deployment

- [ ] Test magic link in production
- [ ] Monitor audit logs for any issues
- [ ] Check email delivery rates
- [ ] Monitor rate limiting effectiveness
- [ ] Gather user feedback
- [ ] Document any issues in GitHub

---

## Phase 9: Monitoring & Analytics

### 9.1 Metrics to Track

- **Authentication Metrics**
  - Magic link requests per day
  - Magic link success rate
  - Magic link failure reasons
  - Average time to click link
  - Rate limit hits per day

- **User Behavior**
  - Percentage of users choosing magic link vs password
  - New account creation via magic link
  - Magic link preference settings adoption

- **Security Metrics**
  - Failed magic link attempts
  - Expired link usage attempts
  - Brute force detection triggers
  - Suspicious IP patterns

### 9.2 Monitoring Dashboard

Create admin dashboard to view magic link statistics:

**File**: `app/admin/analytics/magic-link/page.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MagicLinkAnalytics() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    successfulLogins: 0,
    failedAttempts: 0,
    rateLimitHits: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const supabase = createClient();
    
    // Query audit logs for stats
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("action", "magic_link_login")
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (data) {
      setStats({
        totalRequests: data.length,
        successfulLogins: data.filter(log => log.status === "success").length,
        failedAttempts: data.filter(log => log.status === "failure").length,
        rateLimitHits: data.filter(log => log.error_message?.includes("rate limit")).length,
      });
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Magic Link Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Successful Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.successfulLogins}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalRequests > 0 
                ? `${((stats.successfulLogins / stats.totalRequests) * 100).toFixed(1)}% success rate`
                : "N/A"
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedAttempts}</div>
            <p className="text-xs text-muted-foreground">Expired or invalid links</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Rate Limit Hits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.rateLimitHits}</div>
            <p className="text-xs text-muted-foreground">Blocked requests</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## Implementation Checklist (Summary)

### Phase 1: Basic Implementation ✅
- [ ] Create `/auth/magic-link` page
- [ ] Create `MagicLinkForm` component
- [ ] Update login form with magic link option
- [ ] Enhance `/auth/confirm` route
- [ ] Create enhanced error page

### Phase 2: Security & Rate Limiting ✅
- [ ] Configure Supabase email templates
- [ ] Set up rate limiting in Supabase
- [ ] Create rate limiter utility
- [ ] Add client-side rate limiting to form

### Phase 3: Security Enhancements ✅
- [ ] Create audit logging utility
- [ ] Create audit_logs table migration
- [ ] Create IP tracking utility
- [ ] Update confirm route with audit logging

### Phase 4: User Experience ✅
- [ ] Create success message component
- [ ] Add loading states
- [ ] Create verification page
- [ ] Update protected page with success message

### Phase 5: Integration ✅
- [ ] Integrate with 2FA/MFA
- [ ] Create MFA challenge page
- [ ] Integrate with RBAC
- [ ] Create user preferences table
- [ ] Create magic link settings component

### Phase 6: Mobile Deep Linking 🔮
- [ ] Configure iOS universal links
- [ ] Configure Android app links
- [ ] Test deep linking on mobile devices

### Phase 7: Testing ✅
- [ ] Create BDD step definitions
- [ ] Write unit tests for utilities
- [ ] Write integration tests
- [ ] Test all scenarios from feature file

### Phase 8: Deployment ✅
- [ ] Run database migrations
- [ ] Deploy frontend changes
- [ ] Configure Supabase dashboard
- [ ] Test in production
- [ ] Monitor for issues

### Phase 9: Monitoring ✅
- [ ] Set up analytics tracking
- [ ] Create admin dashboard
- [ ] Monitor metrics
- [ ] Gather user feedback

---

## File Structure Summary

```
tikkit_webapp/
├── app/
│   ├── auth/
│   │   ├── magic-link/
│   │   │   └── page.tsx                    [NEW]
│   │   ├── mfa-challenge/
│   │   │   └── page.tsx                    [NEW]
│   │   ├── verifying/
│   │   │   └── page.tsx                    [NEW]
│   │   ├── confirm/
│   │   │   └── route.ts                    [ENHANCED]
│   │   └── error/
│   │       └── page.tsx                    [ENHANCED]
│   └── admin/
│       └── analytics/
│           └── magic-link/
│               └── page.tsx                [NEW]
├── components/
│   ├── magic-link-form.tsx                 [NEW]
│   ├── login-form.tsx                      [ENHANCED]
│   ├── settings/
│   │   └── magic-link-settings.tsx         [NEW]
│   └── ui/
│       ├── loading-spinner.tsx             [NEW]
│       └── alert.tsx                       [NEW]
├── lib/
│   ├── utils/
│   │   ├── rate-limiter.ts                 [NEW]
│   │   ├── audit-logger.ts                 [NEW]
│   │   ├── get-client-ip.ts                [NEW]
│   │   └── __tests__/
│   │       └── rate-limiter.test.ts        [NEW]
├── supabase/
│   └── migrations/
│       ├── create_audit_logs.sql           [NEW]
│       ├── user_preferences.sql            [NEW]
│       └── magic_link_user_roles.sql       [NEW]
├── tests/
│   ├── features/
│   │   └── magiclink.feature               [EXISTS]
│   ├── steps/
│   │   └── magic-link.steps.ts             [NEW]
│   └── integration/
│       └── magic-link.test.ts              [NEW]
└── public/
    └── .well-known/
        ├── apple-app-site-association      [NEW]
        └── assetlinks.json                 [NEW]
```

---

## Next Steps

1. **Start with Phase 1**: Implement basic magic link functionality
2. **Test thoroughly**: Ensure email delivery and link validation works
3. **Add security**: Implement rate limiting and audit logging
4. **Enhance UX**: Add loading states and success messages
5. **Integrate**: Connect with 2FA and RBAC systems
6. **Deploy**: Follow deployment checklist
7. **Monitor**: Track metrics and gather feedback

---

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase OTP/Magic Links](https://supabase.com/docs/guides/auth/auth-magic-link)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)
- [Email Best Practices](https://www.emailonacid.com/blog/article/email-development/email-best-practices)

---

**Created**: November 18, 2025  
**Last Updated**: November 18, 2025  
**Status**: Planning Phase  
**Priority**: High

