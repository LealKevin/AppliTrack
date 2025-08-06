import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { Badge } from "@/shared/components/ui/badge";
import useApplications from "@/features/applications/hooks/useApplications";
import { BarChart3 } from "lucide-react";

const COLORS = {
  sent: "#10b981", // green
  pending: "#f59e0b", // yellow
  rejected: "#ef4444", // red
  interview_scheduled: "#8b5cf6", // purple
};

const chartConfig = {
  sent: { label: "Sent", color: COLORS.sent },
  pending: { label: "Pending", color: COLORS.pending },
  rejected: { label: "Rejected", color: COLORS.rejected },
  interview_scheduled: { label: "Interview", color: COLORS.interview_scheduled },
};

export function StatusPipelineChart() {
  const { appsCount, isLoading } = useApplications("all");

  if (isLoading || !appsCount) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Application Pipeline
          </CardTitle>
          <CardDescription>Status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: "Sent", value: appsCount.sent_count, color: COLORS.sent },
    { name: "Pending", value: appsCount.pending_count, color: COLORS.pending },
    { name: "Rejected", value: appsCount.rejected_count, color: COLORS.rejected },
  ].filter(item => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Application Pipeline
        </CardTitle>
        <CardDescription>
          Status distribution of {total} applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <ChartContainer config={chartConfig} className="h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value, name) => [
                        `${value} applications`,
                        name
                      ]}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <Badge variant="outline" className="text-xs">
                {item.name}: {item.value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}