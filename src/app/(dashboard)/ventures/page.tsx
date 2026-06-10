"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { stageColors, statusColors, type Stage } from "@/lib/data/ventures";
import { fetchVentures, type Venture } from "@/lib/data/api";
import { Boxes, Plus } from "lucide-react";

const stages: (Stage | "all")[] = ["all", "idea", "validation", "build", "scale", "sunset"];

export default function VenturesPage() {
  const [filter, setFilter] = useState<Stage | "all">("all");
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const filtered = filter === "all" ? ventures : ventures.filter((v) => v.stage === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ventures</h1>
          <p className="text-muted-foreground">{ventures.length} ventures across the portfolio</p>
        </div>
        <Link href="/ventures/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Venture
          </Button>
        </Link>
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

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {stages.map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
            className="capitalize"
          >
            {s === "all" ? "All" : s}
            <Badge variant="secondary" className="ml-2 text-xs">
              {s === "all" ? ventures.length : ventures.filter((v) => v.stage === s).length}
            </Badge>
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-full">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-5 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : ventures.length === 0 && !error ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Boxes className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">No ventures yet</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Add your first venture, or load demo data from the Dashboard to explore the
                12 Cities portfolio.
              </p>
            </div>
            <Link href="/ventures/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Venture
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Venture Grid */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <Link key={v.id} href={`/ventures/${v.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{v.name}</h3>
                      <p className="text-sm text-muted-foreground">{v.domain}</p>
                    </div>
                    <Badge variant="outline">Tier {v.tier}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{v.thesis}</p>
                  <div className="flex gap-2">
                    <Badge className={stageColors[v.stage]}>{v.stage}</Badge>
                    <Badge className={statusColors[v.status]}>{v.status}</Badge>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Budget: ${(v.capitalBudget / 1000).toFixed(0)}K</span>
                    <span>Spent: ${(v.capitalSpent / 1000).toFixed(0)}K</span>
                    <span>
                      Validation: {v.validationChecks.filter((c) => c.status === "passed").length}/{v.validationChecks.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
