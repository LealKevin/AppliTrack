import ReminderDashboard from "../../features/reminders/components/ReminderDashboard";

function HomePage() {
  return (
    <>
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back!
            </h1>
            <p className="text-muted-foreground">
              Here's what needs your attention today.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Primary Column - Reminders */}
            <div className="lg:col-span-2">
              <ReminderDashboard />
            </div>

            {/* Secondary Column - Quick Stats & Actions */}
            <div className="space-y-6">
              {/* Quick Stats Card */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Applications this week</span>
                    <span className="font-medium">--</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response rate</span>
                    <span className="font-medium">--</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active reminders</span>
                    <span className="font-medium">--</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <a 
                    href="/applications" 
                    className="block p-3 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors text-sm"
                  >
                    + Add new application
                  </a>
                  <a 
                    href="/applications" 
                    className="block p-3 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors text-sm"
                  >
                    📊 View applications table
                  </a>
                  <a 
                    href="/stats" 
                    className="block p-3 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors text-sm"
                  >
                    📈 View analytics
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
