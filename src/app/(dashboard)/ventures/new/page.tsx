"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewVenturePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", domain: "", tier: "1", thesis: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production, this would save to Supabase
    alert(`Venture "${form.name}" created! (Mock — would save to database)`);
    router.push("/ventures");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/ventures">
          <Button variant="ghost" size="sm"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Venture</h1>
        <p className="text-muted-foreground">Add a new venture to the portfolio</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Venture Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Venture Name</Label>
              <Input id="name" placeholder="e.g., Neurl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" placeholder="e.g., neurl.sg" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier">Tier</Label>
              <div className="flex gap-3">
                {["1", "2", "3"].map((t) => (
                  <Button key={t} type="button" variant={form.tier === t ? "default" : "outline"} onClick={() => setForm({ ...form, tier: t })}>
                    Tier {t}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="thesis">Thesis</Label>
              <Textarea id="thesis" placeholder="What problem does this venture solve?" value={form.thesis} onChange={(e) => setForm({ ...form, thesis: e.target.value })} rows={4} required />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit">Create Venture</Button>
              <Link href="/ventures"><Button variant="outline">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
