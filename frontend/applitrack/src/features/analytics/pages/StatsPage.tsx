import { AnalyticsCards } from "../components/analytics-cards";
import { ChartAreaInteractive } from "../components/chart-area-interactive";
import { StatusPipelineChart } from "../components/status-pipeline-chart";

function StatsPage() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<AnalyticsCards />
					<div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @4xl/main:grid-cols-2">
						<ChartAreaInteractive />
						<StatusPipelineChart />
					</div>
				</div>
			</div>
		</div>
	);
}

export default StatsPage;
