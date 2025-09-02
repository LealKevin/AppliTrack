import { AnalyticsCards } from "../components/analytics-cards";
import { ChartAreaInteractive } from "../components/chart-area-interactive";
import { StatusPipelineChart } from "../components/status-pipeline-chart";

function StatsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">

        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 lg:flex-row lg:items-stretch">
          <div className="flex-1">
            <AnalyticsCards />
          </div>

          <div className="lg:w-80 lg:flex-shrink-0">
            <div className="px-4 lg:px-0 h-full">
              <StatusPipelineChart />
            </div>
          </div>
        </div>
        <ChartAreaInteractive />
      </div>
    </div>
  );
}

export default StatsPage;
