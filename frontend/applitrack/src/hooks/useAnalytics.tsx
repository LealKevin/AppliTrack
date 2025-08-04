import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type AnalyticsOverview = {
  total_applications: number;
  success_rate: number;
  applications_this_week: number;
  top_company: string;
};

type AnalyticsTrends = {
  trends: Array<{
    date: string;
    count: number;
  }>;
};

type AnalyticsCompanies = {
  companies: Array<{
    name: string;
    applications: number;
    success_rate: number;
  }>;
};

export function useAnalyticsOverview() {
  return useQuery<AnalyticsOverview>({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const response = await axios.get<AnalyticsOverview>("/api/analytics/overview", {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsTrends(startDate?: string, endDate?: string) {
  return useQuery<AnalyticsTrends>({
    queryKey: ["analytics", "trends", startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      
      const response = await axios.get<AnalyticsTrends>(`/api/analytics/trends?${params}`, {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsCompanies() {
  return useQuery<AnalyticsCompanies>({
    queryKey: ["analytics", "companies"],
    queryFn: async () => {
      const response = await axios.get<AnalyticsCompanies>("/api/analytics/companies", {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}