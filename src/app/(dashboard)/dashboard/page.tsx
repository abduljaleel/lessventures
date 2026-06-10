"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { stageColors, statusColors } from "@/lib/data/ventures";
import { fetchVentures, seedDemoData, type Venture } from "@/lib/data/api";
import Link from "next/link";
import { Boxes, TrendingUp, AlertCircle, DollarSign, LoaderCircle, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVentures(await fetchVentures());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load ventures");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    try {
      await seedDemoData();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load demo data");
      setSeeding(false);
      return;
    }
    setSeeding(false);
  };

  const active = ventures.filter((v) => v.status === "active");
  const inValidation = ventures.filter((v) => v.stage === "validation");
  const totalBudget = ventures.reduce((s, v) => s + v.capitalBudget, 0);
  const totalSpent = ventures.reduce((s, v) => s + v.capitalSpent, 0);
  const stages = ["idea", "validation", "build", "scale", "sunset"] as const;
  const stageCounts = stages.map((s) => ({ stage: s, count: ventures.filter((v) => v.stage === s).length }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Dashboard</h1>
        <p className="text-muted-foreground">12 Cities venture system overview</p>
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
        <DashboardSkeleton />
      ) : ventures.length === 0 && !error ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Boxes className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">No ventures yet</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Add your first venture from the Ventures page, or load demo data to explore
                Mend with the 12 Cities portfolio.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button onClick={() => void handleSeed()} disabled={seeding}>
                {seeding ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {seeding ? "Loading demo data..." : "Load demo data"}
              </Button>
              <Link href="/ventures/new">
                <Button variant="outline">Add Venture</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : ventures.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard icon={<Boxes className="h-4 w-4 text-muted-foreground" />} title="Total Ventures" value={String(ventures.length)} description="Across 3 tiers" />
            <MetricCard icon={<TrendingUp className="h-4 w-4 text-green-600" />} title="Active" value={String(active.length)} description={`${inValidation.length} in validation`} />
            <MetricCard icon={<AlertCircle className="h-4 w-4 text-yellow-600" />} title="In Validation" value={String(inValidation.length)} description="Awaiting stage gate review" />
            <MetricCard icon={<DollarSign className="h-4 w-4 text-blue-600" />} title="Capital Deployed" value={`$${(totalSpent / 1000).toFixed(0)}K`} description={`of $${(totalBudget / 1000).toFixed(0)}K budgeted`} />
          </div>

          {/* Stage Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Stage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stageCounts.map(({ stage, count }) => (
                  <div key={stage} className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium capitalize">{stage}</span>
                    <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full bg-primary/80 rounded-md flex items-center px-2"
                        style={{ width: `${(count / ventures.length) * 100}%` }}
                      >
                        <span className="text-xs text-primary-foreground font-medium">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ventures by Tier */}
          <div className="grid gap-6 lg:grid-cols-3">
            {([1, 2, 3] as const).map((tier) => (
              <Card key={tier}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Tier {tier} {tier === 1 ? "— Core" : tier === 2 ? "— Depth" : "— Frontier"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ventures.filter((v) => v.tier === tier).map((v) => (
                    <Link
                      key={v.id}
                      href={`/ventures/${v.id}`}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <span className="font-medium text-sm">{v.name}</span>
                        <p className="text-xs text-muted-foreground">{v.domain}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={stageColors[v.stage]}>{v.stage}</Badge>
                        <Badge variant="outline" className={statusColors[v.status]}>{v.status}</Badge>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function MetricCard({ icon, title, value, description }: { icon: React.ReactNode; title: string; value: string; description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
