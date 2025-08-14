import { useState, useMemo } from "react";
import { Calendar, MapPin, Building } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { useInterviewApplications } from "../hooks/useInterviewApplications";

export default function InterviewsPage() {
  const [searchText, setSearchText] = useState("");

  // Get all applications in interview stages
  const { data: interviewApplications = [], isLoading, error } = useInterviewApplications();
  

  const filteredApplications = useMemo(() => {
    if (!searchText) return interviewApplications;
    
    const search = searchText.toLowerCase();
    return interviewApplications.filter(app =>
      app.Application.company.toLowerCase().includes(search) ||
      app.Application.title_application.toLowerCase().includes(search) ||
      app.Application.location?.toLowerCase().includes(search)
    );
  }, [searchText, interviewApplications]);

  const handleManageRounds = (applicationId: string, company: string) => {
    window.location.href = `/rounds?application=${applicationId}&company=${encodeURIComponent(company)}&from=interviews`;
  };

  const getCurrentRoundDisplay = (rounds: any[]) => {
    if (!rounds || rounds.length === 0) {
      return { text: "No rounds", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400" };
    }
    
    const currentRound = rounds[0]; // Backend orders by updated_at DESC
    const typeDisplay = currentRound.type.replace('_', ' ').split(' ').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    const statusDisplay = currentRound.status.charAt(0).toUpperCase() + currentRound.status.slice(1);
    
    let color = "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    if (currentRound.status === "completed" || currentRound.status === "passed") {
      color = "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    } else if (currentRound.status === "failed") {
      color = "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    } else if (currentRound.status === "scheduled") {
      color = "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    }
    
    return {
      text: `${typeDisplay} - ${statusDisplay}`,
      color
    };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduled Interviews</h1>
          <p className="text-muted-foreground">
            Applications in interview stages
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {isLoading ? "Loading..." : `${interviewApplications.length} applications in interview process`}
        </Badge>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search by company, role, interviewer, or type..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-sm"
          />
        </div>
        {searchText && (
          <Button
            variant="outline"
            onClick={() => setSearchText("")}
            size="sm"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load interview applications. Please try again.</p>
        </div>
      )}

      {/* Applications Table */}
      {!isLoading && !error && (
        <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Applied Date</TableHead>
              <TableHead>Company & Role</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.Application.id}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span>{new Date(application.Application.sent_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col space-y-1">
                      <div className="font-medium text-sm">{application.Application.company}</div>
                      <div className="text-xs text-muted-foreground">{application.Application.title_application}</div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {(() => {
                    const roundDisplay = getCurrentRoundDisplay(application.Rounds);
                    return (
                      <Badge 
                        variant="outline" 
                        className={`${roundDisplay.color} border-none text-xs`}
                      >
                        {roundDisplay.text}
                      </Badge>
                    );
                  })()}
                </TableCell>

                <TableCell>
                  {application.Application.location ? (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span>{application.Application.location}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Remote/TBD</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    {application.Application.url_application && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(application.Application.url_application, '_blank')}
                        className="h-7 text-xs"
                      >
                        View Job
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManageRounds(application.Application.id, application.Application.company)}
                      className="h-7 text-xs"
                    >
                      Manage Rounds
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      )}

      {filteredApplications.length === 0 && searchText && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No applications found matching "{searchText}"</p>
        </div>
      )}

      {filteredApplications.length === 0 && !searchText && !isLoading && !error && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No interview applications found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Applications need to be in "Interview Scheduled" or "Interviewing" status to appear here
          </p>
        </div>
      )}
    </div>
  );
}