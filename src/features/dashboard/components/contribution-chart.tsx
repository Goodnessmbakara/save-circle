"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { contributionVsPayout } from "@/data/mock-data"
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export const ContributionChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Contributions vs Payouts</CardTitle>
      <p className="text-sm text-muted-foreground">Weekly Lightning volume settled through ROSCA groups.</p>
    </CardHeader>
    <CardContent className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={contributionVsPayout}>
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="contributions" fill="#2563eb" radius={6} />
          <Bar dataKey="payouts" fill="#f97316" radius={6} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

