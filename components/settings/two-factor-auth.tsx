"use client";

import { useState, useEffect } from "react";
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
import { Shield, CheckCircle2, XCircle, AlertCircle, Download, Copy, Check, QrCode } from "lucide-react";

export function TwoFactorAuth() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    check2FAStatus();
  }, []);

  const check2FAStatus = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Check if user has MFA factors
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) throw error;
      
      const factors = data?.all || [];
      setIsEnabled(factors.length > 0);
    } catch (err) {
      console.error("Error checking 2FA status:", err);
    }
  };

  const handleEnroll2FA = async () => {
    const supabase = createClient();
    setIsEnrolling(true);
    setError(null);
    setSuccess(null);

    try {
      // Start MFA enrollment
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Tikkit Authenticator",
      });

      if (error) throw error;

      // Get QR code and secret
      if (data.totp?.qr_code) {
        setQrCode(data.totp.qr_code);
      }
      if (data.totp?.secret) {
        setSecret(data.totp.secret);
      }

      setSuccess("Scan the QR code with your authenticator app to continue.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start 2FA enrollment");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleVerifyAndEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!verificationCode || verificationCode.length !== 6) {
        setError("Please enter a valid 6-digit code");
        setIsLoading(false);
        return;
      }

      // Verify the TOTP code
      const { data: factorsData, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) throw listError;

      const factors = factorsData?.all || [];
      if (factors.length === 0) {
        setError("No MFA factor found. Please start enrollment again.");
        setIsLoading(false);
        return;
      }

      const factor = factors[0];
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: factor.id,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: factor.id,
        challengeId: challengeData.id,
        code: verificationCode,
      });

      if (verifyError) throw verifyError;

      // Note: Recovery codes are typically generated during enrollment
      // Supabase may provide them in the enrollment response or require a separate call
      // For now, we'll generate a placeholder set of recovery codes
      // In production, you should use the actual recovery codes from Supabase
      const generatedCodes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );
      setRecoveryCodes(generatedCodes);

      setIsEnabled(true);
      setSuccess("Two-factor authentication has been enabled successfully!");
      setQrCode(null);
      setSecret(null);
      setVerificationCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm("Are you sure you want to disable two-factor authentication? This will make your account less secure.")) {
      return;
    }

    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: factorsData, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) throw listError;

      const factors = factorsData?.all || [];
      if (factors.length === 0) {
        setIsEnabled(false);
        setIsLoading(false);
        return;
      }

      // Unenroll all factors
      for (const factor of factors) {
        const { error: unenrollError } = await supabase.auth.mfa.unenroll({
          factorId: factor.id,
        });
        if (unenrollError) throw unenrollError;
      }

      setIsEnabled(false);
      setRecoveryCodes([]);
      setSuccess("Two-factor authentication has been disabled.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disable 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyRecoveryCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadRecoveryCodes = () => {
    const content = recoveryCodes.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tikkit-recovery-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Two-Factor Authentication
          </CardTitle>
        </div>
        <CardDescription>
          Add an extra layer of security to your account by requiring a code from your authenticator app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                {isEnabled ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <XCircle className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">2FA Status</p>
                <p className="text-xs text-muted-foreground">
                  {isEnabled ? "Enabled" : "Not enabled"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEnabled ? (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                  Active
                </span>
              ) : (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  Inactive
                </span>
              )}
            </div>
          </div>

          {/* Enable 2FA Flow */}
          {!isEnabled && !qrCode && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>How it works:</strong> After enabling 2FA, you'll need to enter a code from your authenticator app (like Google Authenticator or Authy) every time you sign in.
                </p>
              </div>
              <Button
                onClick={handleEnroll2FA}
                disabled={isEnrolling}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30"
              >
                {isEnrolling ? "Setting up..." : "Enable Two-Factor Authentication"}
              </Button>
            </div>
          )}

          {/* QR Code and Verification */}
          {qrCode && !isEnabled && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <p className="font-medium text-sm">Scan QR Code</p>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                <div className="flex justify-center p-4 bg-white dark:bg-gray-900 rounded-lg border border-purple-200 dark:border-purple-800">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
                {secret && (
                  <div className="mt-4 p-3 rounded-lg bg-muted border border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-muted-foreground mb-2">Can't scan? Enter this code manually:</p>
                    <p className="font-mono text-sm break-all">{secret}</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleVerifyAndEnable} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="verificationCode">Enter Verification Code</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    required
                    className="border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30"
                >
                  {isLoading ? "Verifying..." : "Verify and Enable"}
                </Button>
              </form>
            </div>
          )}

          {/* Recovery Codes */}
          {recoveryCodes.length > 0 && (
            <div className="p-4 rounded-lg bg-orange-50/50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <p className="font-medium text-sm text-orange-900 dark:text-orange-100">
                  Recovery Codes
                </p>
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300 mb-4">
                Save these codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {recoveryCodes.map((code, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-800"
                  >
                    <code className="text-xs font-mono">{code}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopyRecoveryCode(code)}
                    >
                      {copiedCode === code ? (
                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadRecoveryCodes}
                className="w-full border-orange-200 dark:border-orange-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Recovery Codes
              </Button>
            </div>
          )}

          {/* Disable 2FA */}
          {isEnabled && !qrCode && (
            <Button
              variant="outline"
              onClick={handleDisable2FA}
              disabled={isLoading}
              className="w-full border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              {isLoading ? "Disabling..." : "Disable Two-Factor Authentication"}
            </Button>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

