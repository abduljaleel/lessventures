"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");
      }
    }
    loadProfile();
  }, [supabase]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setStatus(null);

    // Persist to BOTH the auth user_metadata (header avatar/menu reads this)
    // and the public.profiles row (api.ts reads profiles.full_name for the
    // venture owner display) so the two never drift out of sync.
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    let failure = authError?.message ?? null;
    if (!failure) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: fullName })
          .eq("id", user.id);
        if (profileError) failure = profileError.message;
      }
    }

    if (failure) {
      setStatus("error");
      setMessage(failure);
    } else {
      setStatus("success");
      setMessage("Profile updated successfully");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
            {message && (
              <div
                className={
                  status === "error"
                    ? "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                    : "rounded-md border border-green-600/30 bg-green-600/10 p-3 text-sm text-green-700 dark:text-green-400"
                }
              >
                {message}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
