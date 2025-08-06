import { TrendingUp, TrendingDown, Building2, Target, Clock, Zap, FileText } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useAnalyticsOverview } from "../hooks/useAnalytics";
import useApplications from "@/features/applications/hooks/useApplications";

export function AnalyticsCards() {
  const { data: overview, isLoading } = useAnalyticsOverview();
  const { appsCount } = useApplications("all");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @4xl/main:grid-cols-3 @6xl/main:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const totalApps = overview?.total_applications ?? appsCount?.all_count ?? 0;
  const successRate = overview?.success_rate ?? 0;
  const weeklyApps = overview?.applications_this_week ?? 0;
  const topCompany = overview?.top_company ?? "N/A";

  const avgResponseDays = 5;
  const weeklyVelocity = weeklyApps > 0 ? (weeklyApps / 7).toFixed(1) : "0";

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 sm:grid-cols-2 lg:grid-cols-2 lg:gap-6 lg:h-full">

      <Card className="@container/card lg:h-full lg:flex lg:flex-col">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Total Applications
          </CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
            {totalApps}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Applications submitted
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card lg:h-full lg:flex lg:flex-col">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Success Rate
          </CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
            {successRate.toFixed(1)}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2">
              {successRate > 20 ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600 flex-shrink-0">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Good
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex-shrink-0">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Improving
                </Badge>
              )}
            </div>
            <div className="line-clamp-1 text-xs font-medium">
              Applications getting responses
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card lg:h-full lg:flex lg:flex-col">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Avg Response Time
          </CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
            {avgResponseDays} days
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Badge variant="outline">Industry avg: 7 days</Badge>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card lg:h-full lg:flex lg:flex-col">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Weekly Velocity
          </CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
            {weeklyVelocity}/day
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {weeklyApps} applications this week
          </div>
        </CardFooter>
      </Card>

      {/*<Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Top Company
          </CardDescription>
          <CardTitle className="text-xl font-semibold @[250px]/card:text-2xl truncate">
            {topCompany}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Most applications sent
          </div>
        </CardFooter>
      </Card>*/}
    </div>
  );
}
