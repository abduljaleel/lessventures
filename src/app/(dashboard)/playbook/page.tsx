"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ChevronDown, ChevronRight } from "lucide-react";

const playbooks = [
  {
    id: "1", name: "Customer Discovery", category: "Validation",
    description: "Validate that real customers have the problem you think they have.",
    items: [
      "Identify 10+ potential customers in the target segment",
      "Conduct 5+ problem interviews (no pitching)",
      "Document pain frequency and severity (1-5 scale)",
      "Identify current alternatives and workarounds",
      "Synthesize into a problem statement with evidence",
    ],
  },
  {
    id: "2", name: "Technical Feasibility", category: "Validation",
    description: "Prove the core technical approach works before building the full product.",
    items: [
      "Define the core technical hypothesis",
      "Build a minimal proof-of-concept (1-2 weeks max)",
      "Identify key technical risks and dependencies",
      "Benchmark against alternatives (speed, cost, accuracy)",
      "Document architecture decisions and trade-offs",
    ],
  },
  {
    id: "3", name: "Commercial Viability", category: "Validation",
    description: "Confirm people will pay before you build the business.",
    items: [
      "Define pricing model and initial price point",
      "Get 3+ letters of intent or pilot commitments",
      "Calculate unit economics (CAC, LTV, gross margin)",
      "Identify the first distribution channel",
      "Validate willingness to pay through pre-sales or deposits",
    ],
  },
  {
    id: "4", name: "MVP Design", category: "Build",
    description: "Design the narrowest product that tests the core thesis.",
    items: [
      "Define the single core workflow (not a feature list)",
      "Scope to < 4 weeks of build time",
      "Ensure it is demoable to a customer",
      "Add instrumentation for key metrics",
      "Define success criteria before launch",
    ],
  },
  {
    id: "5", name: "Stage Gate Review", category: "Governance",
    description: "Structured decision point before advancing to the next stage.",
    items: [
      "Review all validation checklist items",
      "Present evidence for each check (pass/fail/skip)",
      "Assess capital efficiency and burn rate",
      "Evaluate against portfolio-level priorities",
      "Make formal decision: Proceed / Pivot / Kill",
      "Document decision rationale in the activity log",
    ],
  },
  {
    id: "6", name: "Capital Allocation", category: "Governance",
    description: "Disciplined framework for allocating capital across the portfolio.",
    items: [
      "Review current stage and validation status",
      "Assess burn rate vs. learning velocity",
      "Compare opportunity cost across portfolio",
      "Set budget with clear milestones and checkpoints",
      "Define conditions for additional allocation or cut",
    ],
  },
];

export default function PlaybookPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Venture Playbook</h1>
        <p className="text-muted-foreground">Templates and checklists for disciplined venture building</p>
      </div>

      <div className="space-y-4">
        {playbooks.map((pb) => (
          <Card key={pb.id} className="cursor-pointer" onClick={() => setExpanded(expanded === pb.id ? null : pb.id)}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              {expanded === pb.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{pb.name}</CardTitle>
                  <Badge variant="outline">{pb.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{pb.description}</p>
              </div>
              <Badge variant="secondary">{pb.items.length} items</Badge>
            </CardHeader>
            {expanded === pb.id && (
              <CardContent className="pt-0">
                <div className="space-y-2 ml-8">
                  {pb.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                      <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
