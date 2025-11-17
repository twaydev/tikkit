"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { CheckCircle2, AlertCircle, Copy, Check, Upload, X, User } from "lucide-react";

interface GeneralSettingsProps {
  initialDisplayName: string;
  email: string;
  userId: string;
  initialAvatarUrl?: string | null;
}

export function GeneralSettings({ initialDisplayName, email, userId, initialAvatarUrl }: GeneralSettingsProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl || null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string | null, email: string): string => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name[0].toUpperCase();
    }
    return email[0].toUpperCase();
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];
    if (!file) return;

    const supabase = createClient();
    setIsUploadingAvatar(true);
    setError(null);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not found");
      }

      // Generate unique file path for avatar
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Delete old avatar if it exists
      if (avatarUrl && avatarUrl.startsWith("http")) {
        try {
          // Extract path from URL if it's a storage URL
          const oldPathMatch = avatarUrl.match(/\/storage\/v1\/object\/public\/avatars\/(.+)/);
          if (oldPathMatch) {
            await supabase.storage.from("avatars").remove([oldPathMatch[1]]);
          }
        } catch (deleteError) {
          // Ignore delete errors - old avatar might not exist
          console.warn("Failed to delete old avatar:", deleteError);
        }
      }

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true, // Replace if exists
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload avatar");
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error("Failed to get avatar URL");
      }

      const avatarPublicUrl = urlData.publicUrl;

      // Update user metadata with avatar URL (not base64)
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          avatar_url: avatarPublicUrl,
        },
      });

      if (updateError) throw updateError;

      setAvatarUrl(avatarPublicUrl);
      setAvatarPreview(null);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Refresh to update sidebar avatar
        router.refresh();
      }, 2000);
      
      // Reset file input
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    const supabase = createClient();
    setIsUploadingAvatar(true);
    setError(null);

    try {
      // Delete avatar from storage if it exists
      if (avatarUrl && avatarUrl.startsWith("http")) {
        try {
          // Extract path from URL if it's a storage URL
          const pathMatch = avatarUrl.match(/\/storage\/v1\/object\/public\/avatars\/(.+)/);
          if (pathMatch) {
            await supabase.storage.from("avatars").remove([pathMatch[1]]);
          }
        } catch (deleteError) {
          // Ignore delete errors - avatar might not exist in storage
          console.warn("Failed to delete avatar from storage:", deleteError);
        }
      }

      // Update user metadata to remove avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          avatar_url: null,
        },
      });

      if (updateError) throw updateError;

      setAvatarUrl(null);
      setAvatarPreview(null);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Refresh to update sidebar avatar
        router.refresh();
      }, 2000);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to remove avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updateData: { display_name?: string } = {
        display_name: displayName,
      };

      // Note: Avatar should be uploaded separately using handleAvatarUpload
      // Don't include avatar_url here to avoid HTTP 431 errors

      const { error } = await supabase.auth.updateUser({
        data: updateData,
      });

      if (error) throw error;

      setSuccess(true);
      setAvatarPreview(null);
      setTimeout(() => {
        setSuccess(false);
        // Refresh to update sidebar avatar if avatar was updated
        if (avatarPreview) {
          router.refresh();
        }
      }, 2000);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          General Information
        </CardTitle>
        <CardDescription>
          Update your profile information and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="grid gap-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              {/* Avatar Display */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-purple-500/30 overflow-hidden">
                  {avatarPreview || avatarUrl ? (
                    <img
                      src={avatarPreview || avatarUrl || ""}
                      alt={displayName || email}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(displayName, email)}</span>
                  )}
                </div>
                {(avatarPreview || avatarUrl) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={isUploadingAvatar}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="border-purple-200 dark:border-purple-800"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {avatarPreview ? "Change" : "Upload"} Avatar
                  </Button>
                  {avatarPreview && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isUploadingAvatar ? "Uploading..." : "Save Avatar"}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* User ID (Read-only) */}
          <div className="grid gap-2">
            <Label htmlFor="userId">User ID</Label>
            <div className="flex gap-2">
              <Input
                id="userId"
                type="text"
                value={userId}
                disabled
                className="bg-muted border-purple-200 dark:border-purple-800 font-mono text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(userId);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch (err) {
                    console.error("Failed to copy:", err);
                  }
                }}
                className="border-purple-200 dark:border-purple-800"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your unique user identifier. This cannot be changed.
            </p>
          </div>

          {/* Email (Read-only) */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-muted border-purple-200 dark:border-purple-800"
            />
            <p className="text-xs text-muted-foreground">
              Your email address is managed by your authentication provider and cannot be changed here.
            </p>
          </div>

          {/* Display Name */}
          <div className="grid gap-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600"
            />
            <p className="text-xs text-muted-foreground">
              This name will be displayed in your profile and throughout the application.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-600 dark:text-green-400">
                Profile updated successfully!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || (displayName === initialDisplayName && !avatarPreview)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

