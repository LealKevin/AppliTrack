import useDashboardStats from "../../features/dashboard/hooks/useDashboardStats";
import useUpcomingActions from "../../features/dashboard/hooks/useUpcomingActions";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { TrendingUp, TrendingDown, Plus, User, Clock, ArrowRight, FileText } from "lucide-react";
import { ChartAreaInteractive } from "../../features/analytics/components/chart-area-interactive";
import { StatusPipelineChart } from "../../features/analytics/components/status-pipeline-chart";

function HomePage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { thisWeekActions, isLoading: actionsLoading } = useUpcomingActions();

  const today = new Date();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            {today.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          {stats && stats.applicationsThisWeek > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">
                {stats.applicationsThisWeek} application{stats.applicationsThisWeek !== 1 ? 's' : ''} submitted this week
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <Card className="shadow-sm border-0 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div className="h-8 bg-muted rounded animate-pulse"></div>
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-semibold">
                    {stats?.applicationsThisWeek || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Applications sent
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div className="h-8 bg-muted rounded animate-pulse"></div>
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-semibold">
                    {stats?.totalApplications || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    All time
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div className="h-8 bg-muted rounded animate-pulse"></div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-semibold">
                      {stats?.responseRate || 0}%
                    </div>
                    {stats && stats.responseRate > 0 && (
                      <div className="flex items-center">
                        {stats.responseRate >= 20 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : stats.responseRate >= 10 ? (
                          <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Getting responses
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div className="h-8 bg-muted rounded animate-pulse"></div>
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-semibold">
                    {(stats?.statusCounts.interview_scheduled_count || 0) +
                      (stats?.statusCounts.interviewing_count || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Active interviews
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {!actionsLoading && thisWeekActions.length > 0 && (
          <Card className="shadow-sm border-0 bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {thisWeekActions.slice(0, 3).map(action => (
                <div key={action.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${action.urgency === 'overdue'
                      ? 'bg-red-100 text-red-600'
                      : action.urgency === 'today'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-blue-100 text-blue-600'
                      }`}>
                      {action.type === 'interview' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {action.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {action.company} • {new Date(action.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          ...(action.urgency === 'later' && { year: 'numeric' })
                        })}
                      </div>
                    </div>
                  </div>
                  {action.urgency === 'overdue' && (
                    <Badge variant="destructive" className="text-xs">
                      Overdue
                    </Badge>
                  )}
                  {action.urgency === 'today' && (
                    <Badge variant="default" className="text-xs bg-orange-500 hover:bg-orange-600">
                      Today
                    </Badge>
                  )}
                </div>
              ))}
              {thisWeekActions.length > 3 && (
                <Link to="/reminders" className="block">
                  <Button variant="ghost" className="w-full justify-between">
                    View all {thisWeekActions.length} actions
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}


        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartAreaInteractive />

            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/applications?create=true" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-12 text-base font-medium">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Application
                </Button>
              </Link>

              <div className="flex gap-2">
                <Link to="/applications" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-12 px-6">
                    <FileText className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <StatusPipelineChart />
          </div>
        </div>


      </div>
    </div>
  );
}

export default HomePage;
