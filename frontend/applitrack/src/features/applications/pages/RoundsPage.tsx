import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import RoundCard from "../components/RoundCard";

// Mock data for demonstration
export interface Round {
  id: string;
  title: string;
  type: "phone_screen" | "technical" | "behavioral" | "final" | "onsite";
  status: "scheduled" | "completed" | "passed" | "failed";
  date: string;
  notes: string;
  interviewer?: string;
  duration?: string;
  outcome?: string;
}

const mockRounds: Round[] = [
  {
    id: "1",
    title: "Initial Phone Screen",
    type: "phone_screen",
    status: "completed",
    date: "2024-01-15",
    notes: "General questions about background and experience. Went well overall.",
    interviewer: "Sarah Johnson (HR)",
    duration: "30 min",
    outcome: "Positive - moving to next round"
  },
  {
    id: "2", 
    title: "Technical Interview",
    type: "technical",
    status: "scheduled",
    date: "2024-01-22",
    notes: "Coding challenge and system design questions. Need to review algorithms.",
    interviewer: "Mike Chen (Senior Engineer)",
    duration: "90 min",
  },
  {
    id: "3",
    title: "Final Interview",
    type: "final", 
    status: "scheduled",
    date: "2024-01-25",
    notes: "Meeting with team lead and product manager.",
    interviewer: "Alex Rivera (Team Lead)",
    duration: "60 min",
  }
];

export default function RoundsPage() {
  const [rounds, setRounds] = useState<Round[]>(mockRounds);

  const handleAddRound = () => {
    const newRound: Round = {
      id: Date.now().toString(),
      title: "New Interview Round",
      type: "phone_screen",
      status: "scheduled", 
      date: "",
      notes: "",
    };
    setRounds([...rounds, newRound]);
  };

  const handleDeleteRound = (id: string) => {
    setRounds(rounds.filter(round => round.id !== id));
  };

  const handleUpdateRound = (id: string, updatedRound: Partial<Round>) => {
    setRounds(rounds.map(round => 
      round.id === id ? { ...round, ...updatedRound } : round
    ));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Rounds</h1>
        <p className="text-muted-foreground">
          Keep track of your application rounds
        </p>
      </div>

      <div className="grid gap-4 mb-6">
        {rounds.map((round) => (
          <RoundCard
            key={round.id}
            round={round}
            onDelete={handleDeleteRound}
            onUpdate={handleUpdateRound}
          />
        ))}
      </div>

      <Button
        onClick={handleAddRound}
        variant="outline"
        className="w-full border-dashed border-2 h-20 text-muted-foreground hover:text-foreground"
      >
        <Plus className="h-6 w-6 mr-2" />
        Add New Round
      </Button>
    </div>
  );
}