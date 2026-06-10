"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { tierLabels } from "@/lib/data/ventures";
import { fetchVentures, type Venture } from "@/lib/data/api";
import { ChartColumn } from "lucide-react";

function pct(numerator: number, denominator: number): number {
  return denominator > 0 ? (numerator / denominator) * 100 : 0;
}

export default function PortfolioPage() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVentures(await fetchVentures());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load portfolio data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const totalBudget = ventures.reduce((s, v) => s + v.capitalBudget, 0);
  const totalSpent = ventures.reduce((s, v) => s + v.capitalSpent, 0);
  const byTier = [1, 2, 3].map((tier) => {
    const tv = ventures.filter((v) => v.tier === tier);
    return { tier, count: tv.length, budget: tv.reduce((s, v) => s + v.capitalBudget, 0), spent: tv.reduce((s, v) => s + v.capitalSpent, 0) };
  });

  const distinctStages = new Set(ventures.map((v) => v.stage)).size;
  const inValidation = ventures.filter((v) => v.stage === "validation").length;
  const killed = ventures.filter((v) => v.status === "killed").length;
  const utilization = pct(totalSpent, totalBudget);
  const health = [
    {
      label: "Stage Diversity",
      value: distinctStages >= 3 ? "Good" : distinctStages === 2 ? "Medium" : "Low",
      desc: `Ventures across ${distinctStages} stage${distinctStages === 1 ? "" : "s"}`,
      color: distinctStages >= 3 ? "text-green-600" : "text-yellow-600",
    },
    {
      label: "Validation Velocity",
      value: inValidation >= 5 ? "High" : inValidation >= 2 ? "Medium" : inValidation === 1 ? "Low" : "None",
      desc: `${inValidation} venture${inValidation === 1 ? "" : "s"} in active validation`,
      color: inValidation >= 2 ? "text-yellow-600" : inValidation >= 1 ? "text-yellow-600" : "text-muted-foreground",
    },
    {
      label: "Capital Efficiency",
      value: utilization <= 50 ? "High" : utilization <= 80 ? "Medium" : "Low",
      desc: `${utilization.toFixed(0)}% budget utilized`,
      color: utilization <= 50 ? "text-green-600" : utilization <= 80 ? "text-yellow-600" : "text-red-600",
    },
    {
      label: "Kill Discipline",
      value: killed > 0 ? `${killed} killed` : "N/A",
      desc: killed > 0 ? `${killed} venture${killed === 1 ? "" : "s"} killed to date` : "No ventures killed yet",
      color: killed > 0 ? "text-green-600" : "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Analytics</h1>
        <p className="text-muted-foreground">Capital allocation and venture health across 12 Cities</p>
      </div>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="py-4 flex items-center justify-between gap-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <PortfolioSkeleton />
      ) : ventures.length === 0 && !error ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <ChartColumn className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">No portfolio data yet</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Add ventures or load demo data from the Dashboard to see capital allocation
                and portfolio health.
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      ) : ventures.length > 0 ? (
        <>
          {/* Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Total Budget</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">${(totalBudget / 1000).toFixed(0)}K</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Total Spent</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">${(totalSpent / 1000).toFixed(0)}K</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Burn Rate</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{pct(totalSpent, totalBudget).toFixed(0)}%</div></CardContent>
            </Card>
          </div>

          {/* Capital by Venture */}
          <Card>
            <CardHeader><CardTitle>Capital Allocation by Venture</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[...ventures].sort((a, b) => b.capitalBudget - a.capitalBudget).map((v) => (
                <div key={v.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{v.name}</span>
                      <Badge variant="outline" className="text-xs">T{v.tier}</Badge>
                    </div>
                    <span className="text-muted-foreground">${(v.capitalSpent / 1000).toFixed(0)}K / ${(v.capitalBudget / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary/70 rounded-full" style={{ width: `${pct(v.capitalBudget, totalBudget)}%` }}>
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(pct(v.capitalSpent, v.capitalBudget), 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tier Breakdown */}
          <Card>
            <CardHeader><CardTitle>Tier Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <div className="grid grid-cols-5 gap-4 p-3 text-sm font-medium bg-muted/50">
                  <span>Tier</span><span>Ventures</span><span>Budget</span><span>Spent</span><span>Utilization</span>
                </div>
                {byTier.map((t) => (
                  <div key={t.tier} className="grid grid-cols-5 gap-4 p-3 text-sm border-t">
                    <span className="font-medium">{tierLabels[t.tier as 1 | 2 | 3]}</span>
                    <span>{t.count}</span>
                    <span>${(t.budget / 1000).toFixed(0)}K</span>
                    <span>${(t.spent / 1000).toFixed(0)}K</span>
                    <Badge variant="outline">{pct(t.spent, t.budget).toFixed(0)}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Health */}
          <Card>
            <CardHeader><CardTitle>Portfolio Health</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {health.map((h) => (
                  <div key={h.label} className="rounded-lg border p-4">
                    <p className="text-sm font-medium">{h.label}</p>
                    <p className={`text-lg font-bold ${h.color}`}>{h.value}</p>
                    <p className="text-xs text-muted-foreground">{h.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-20" /></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
