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
    
    if (!error && data.user) {
      // Log successful magic link login
      console.log(`Magic link login successful for user: ${data.user.email}`);
      
      // Redirect user to dashboard with success message
      redirect(`${next}?message=login_success`);
    } else {
      // Handle specific error cases
      const errorMessage = error?.message || "Unknown error";
      
      if (errorMessage.includes("expired") || errorMessage.includes("Token has expired")) {
        redirect(`/auth/error?error=expired_link`);
      } else if (errorMessage.includes("already been used") || errorMessage.includes("Token already used")) {
        redirect(`/auth/error?error=used_link`);
      } else {
        const encodedError = encodeURIComponent(errorMessage);
        redirect(`/auth/error?error=${encodedError}`);
      }
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/auth/error?error=invalid_request`);
}
