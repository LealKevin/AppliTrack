import { useState, useEffect } from "react";
import { Calendar, Clock, User, MessageSquare, Edit, Trash2, CheckCircle, AlertCircle, Clock as ClockIcon, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardAction } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import type { Round } from "@/shared/types/api";
import { useUpdateRound, useDeleteRound } from "../hooks/useRounds";

interface RoundCardProps {
  round: Round;
}

const roundTypeLabels = {
  phone_screen: "Phone Screen",
  technical: "Technical",
  final: "Final",
  onsite: "Onsite"
};

const statusConfig = {
  scheduled: {
    label: "Scheduled",
    icon: ClockIcon,
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  },
  passed: {
    label: "Passed",
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
  }
};

export default function RoundCard({ round }: RoundCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRound, setEditedRound] = useState(round);

  const updateRoundMutation = useUpdateRound();
  const deleteRoundMutation = useDeleteRound();

  useEffect(() => {
    setEditedRound(round);
  }, [round]);

  const handleSave = () => {
    updateRoundMutation.mutate(
      { roundId: round.id, roundData: { ...editedRound, date: editedRound.date || new Date().toISOString() } },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: () => {
        }
      }
    );
  };

  const handleCancel = () => {
    setEditedRound(round);
    setIsEditing(false);
  };

  const status = statusConfig[round.status];
  const StatusIcon = status.icon;

  if (isEditing) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="title">Round Title</Label>
                <Input
                  id="title"
                  value={editedRound.title}
                  onChange={(e) => setEditedRound({ ...editedRound, title: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Round Type</Label>
                  <Select
                    value={editedRound.type}
                    onValueChange={(value: Round["type"]) => setEditedRound({ ...editedRound, type: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="grid grid-cols-1">
                      <SelectItem value="phone_screen">Phone Scrsdeen</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editedRound.status}
                    onValueChange={(value: Round["status"]) => setEditedRound({ ...editedRound, status: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editedRound.date || ''}
                    onChange={(e) => setEditedRound({ ...editedRound, date: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 60 min"
                    value={editedRound.duration || ""}
                    onChange={(e) => setEditedRound({ ...editedRound, duration: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="interviewer">Interviewer</Label>
                <Input
                  id="interviewer"
                  placeholder="Name and role"
                  value={editedRound.interviewer || ""}
                  onChange={(e) => setEditedRound({ ...editedRound, interviewer: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={editedRound.notes}
                  onChange={(e) => setEditedRound({ ...editedRound, notes: e.target.value })}
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                  placeholder="Add notes about this interview round..."
                />
              </div>

              {editedRound.outcome && (
                <div>
                  <Label htmlFor="outcome">Outcome</Label>
                  <Input
                    id="outcome"
                    placeholder="Interview outcome"
                    value={editedRound.outcome || ""}
                    onChange={(e) => setEditedRound({ ...editedRound, outcome: e.target.value })}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              size="sm"
              disabled={updateRoundMutation.isPending}
            >
              {updateRoundMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">Cancel</Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{round.title}</h3>
              <Badge variant="outline" className="text-xs">
                {roundTypeLabels[round.type]}
              </Badge>
            </div>
            <Badge
              variant="outline"
              className={`${status.className} border-none text-xs font-medium`}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>

          <CardAction>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteRoundMutation.mutate(round.id)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
                disabled={deleteRoundMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {round.date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(round.date).toLocaleDateString()}</span>
              </div>
            )}

            {round.duration && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{round.duration}</span>
              </div>
            )}
          </div>

          {round.interviewer && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{round.interviewer}</span>
            </div>
          )}

          {round.notes && (
            <div className="flex items-start gap-2 text-sm">
              <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <p className="text-muted-foreground line-clamp-2">{round.notes}</p>
            </div>
          )}

          {round.outcome && (
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <p className="text-muted-foreground font-medium">{round.outcome}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
