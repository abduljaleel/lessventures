import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ventures, stageColors, tierLabels } from "@/lib/data/ventures";

export default function PortfolioPage() {
  const totalBudget = ventures.reduce((s, v) => s + v.capitalBudget, 0);
  const totalSpent = ventures.reduce((s, v) => s + v.capitalSpent, 0);
  const byTier = [1, 2, 3].map((tier) => {
    const tv = ventures.filter((v) => v.tier === tier);
    return { tier, count: tv.length, budget: tv.reduce((s, v) => s + v.capitalBudget, 0), spent: tv.reduce((s, v) => s + v.capitalSpent, 0) };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Analytics</h1>
        <p className="text-muted-foreground">Capital allocation and venture health across 12 Cities</p>
      </div>

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
          <CardContent><div className="text-2xl font-bold">{((totalSpent / totalBudget) * 100).toFixed(0)}%</div></CardContent>
        </Card>
      </div>

      {/* Capital by Venture */}
      <Card>
        <CardHeader><CardTitle>Capital Allocation by Venture</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {ventures.sort((a, b) => b.capitalBudget - a.capitalBudget).map((v) => (
            <div key={v.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{v.name}</span>
                  <Badge variant="outline" className="text-xs">T{v.tier}</Badge>
                </div>
                <span className="text-muted-foreground">${(v.capitalSpent / 1000).toFixed(0)}K / ${(v.capitalBudget / 1000).toFixed(0)}K</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary/70 rounded-full" style={{ width: `${(v.capitalBudget / totalBudget) * 100}%` }}>
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(v.capitalSpent / v.capitalBudget) * 100}%` }} />
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
                <Badge variant="outline">{((t.spent / t.budget) * 100).toFixed(0)}%</Badge>
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
            {[
              { label: "Stage Diversity", value: "Good", desc: "Ventures spread across stages", color: "text-green-600" },
              { label: "Validation Velocity", value: "Medium", desc: "3 ventures in active validation", color: "text-yellow-600" },
              { label: "Capital Efficiency", value: "High", desc: `${((totalSpent / totalBudget) * 100).toFixed(0)}% budget utilized`, color: "text-green-600" },
              { label: "Kill Discipline", value: "N/A", desc: "No ventures killed yet", color: "text-muted-foreground" },
            ].map((h) => (
              <div key={h.label} className="rounded-lg border p-4">
                <p className="text-sm font-medium">{h.label}</p>
                <p className={`text-lg font-bold ${h.color}`}>{h.value}</p>
                <p className="text-xs text-muted-foreground">{h.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
