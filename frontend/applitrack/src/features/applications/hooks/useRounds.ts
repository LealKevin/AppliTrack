import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRounds, createRound, updateRound, deleteRound } from "@/shared/utils/apiCalls";
import type { Round, CreateRoundRequest, UpdateRoundRequest } from "@/shared/types/api";

// Get rounds for a specific application
export function useRounds(applicationId: string) {
  return useQuery<Round[]>({
    queryKey: ["rounds", applicationId],
    queryFn: () => fetchRounds(applicationId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!applicationId, // Only run if we have an applicationId
  });
}

// Create a new round
export function useCreateRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, roundData }: { applicationId: string; roundData: CreateRoundRequest }) =>
      createRound(applicationId, roundData),
    onSuccess: (_, { applicationId }) => {
      // Invalidate and refetch rounds for this application
      queryClient.invalidateQueries({ queryKey: ["rounds", applicationId] });
      
      // Also invalidate applications queries to update current round column
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (error) => {
      console.error("Failed to create round:", error);
    },
  });
}

// Update an existing round
export function useUpdateRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roundId, roundData }: { roundId: string; roundData: UpdateRoundRequest }) =>
      updateRound(roundId, roundData),
    onMutate: async ({ roundId, roundData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["rounds"] });

      // Optimistic update - find which application this round belongs to
      const roundsQueries = queryClient.getQueriesData({ queryKey: ["rounds"] });
      
      for (const [queryKey, oldRounds] of roundsQueries) {
        if (Array.isArray(oldRounds)) {
          const roundIndex = oldRounds.findIndex((round: Round) => round.id === roundId);
          if (roundIndex !== -1) {
            const newRounds = [...oldRounds];
            newRounds[roundIndex] = { ...oldRounds[roundIndex], ...roundData };
            queryClient.setQueryData(queryKey, newRounds);
            break;
          }
        }
      }
    },
    onSuccess: () => {
      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (error) => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
      console.error("Failed to update round:", error);
    },
  });
}

// Delete a round
export function useDeleteRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRound,
    onMutate: async (roundId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["rounds"] });

      // Optimistic update - remove the round from all relevant queries
      const roundsQueries = queryClient.getQueriesData({ queryKey: ["rounds"] });
      
      for (const [queryKey, oldRounds] of roundsQueries) {
        if (Array.isArray(oldRounds)) {
          const newRounds = oldRounds.filter((round: Round) => round.id !== roundId);
          queryClient.setQueryData(queryKey, newRounds);
        }
      }
    },
    onSuccess: () => {
      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (error) => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
      console.error("Failed to delete round:", error);
    },
  });
}