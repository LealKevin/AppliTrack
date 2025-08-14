import { useState, useEffect } from "react";
import { Plus, ArrowLeft, Building } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import RoundCard from "../components/RoundCard";
import RoundCreateModal from "../components/RoundCreateModal";
import { useRounds } from "../hooks/useRounds";

export default function RoundsPage() {
  const [applicationContext, setApplicationContext] = useState<{
    id: string;
    company: string;
  } | null>(null);
  const [sourceContext, setSourceContext] = useState<{
    from: string;
    label: string;
    url: string;
  }>({
    from: 'applications',
    label: 'Applications',
    url: '/applications'
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // API hooks
  const { data: rounds = [], isLoading, error } = useRounds(applicationContext?.id || "");

  useEffect(() => {
    // Check for query parameters to determine if we're managing rounds for a specific application
    const urlParams = new URLSearchParams(window.location.search);
    const applicationId = urlParams.get('application');
    const company = urlParams.get('company');
    const from = urlParams.get('from');
    
    if (applicationId && company) {
      setApplicationContext({
        id: applicationId,
        company: decodeURIComponent(company)
      });
    }

    // Set source context based on 'from' parameter
    if (from === 'interviews') {
      setSourceContext({
        from: 'interviews',
        label: 'Interviews',
        url: '/interviews'
      });
    } else {
      setSourceContext({
        from: 'applications',
        label: 'Applications',
        url: '/applications'
      });
    }
  }, []);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleBackToSource = () => {
    window.location.href = sourceContext.url;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        {applicationContext ? (
          <>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToSource}
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {sourceContext.label}
              </Button>
              <span>/</span>
              <span>Manage Rounds</span>
            </div>

            {/* Application Context Header */}
            <div className="flex items-center space-x-3 mb-4">
              <Building className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{applicationContext.company}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Application ID: {applicationContext.id}
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">
              Manage interview rounds for this application
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Rounds</h1>
            <p className="text-muted-foreground">
              Keep track of your application rounds
            </p>
          </>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load rounds. Please try again.</p>
        </div>
      )}

      {/* Rounds List */}
      {!isLoading && !error && (
        <>
          <div className="grid gap-4 mb-6">
            {rounds.length > 0 ? (
              rounds.map((round) => (
                <RoundCard
                  key={round.id}
                  round={round}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No interview rounds yet.</p>
                <p className="text-sm">Add your first round below to get started.</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleOpenCreateModal}
            variant="outline"
            className="w-full border-dashed border-2 h-20 text-muted-foreground hover:text-foreground"
            disabled={!applicationContext?.id}
          >
            <Plus className="h-6 w-6 mr-2" />
            Add New Round
          </Button>
        </>
      )}

      {/* Create Round Modal */}
      {applicationContext && (
        <RoundCreateModal
          applicationId={applicationContext.id}
          isModalOpen={isCreateModalOpen}
          handleClose={handleCloseCreateModal}
        />
      )}
    </div>
  );
}