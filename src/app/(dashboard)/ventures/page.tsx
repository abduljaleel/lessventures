"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ventures, stageColors, statusColors, type Stage } from "@/lib/data/ventures";
import { Plus } from "lucide-react";

const stages: (Stage | "all")[] = ["all", "idea", "validation", "build", "scale", "sunset"];

export default function VenturesPage() {
  const [filter, setFilter] = useState<Stage | "all">("all");
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

      {/* Venture Grid */}
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
    </div>
  );
}
