// hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/dashboardApi";
import { useSession } from "next-auth/react";
// import { DashboardSummaryData } from "@/types/dashboard";
import icon1 from "@/public/assets/icon1.png";
import icon2 from "@/public/assets/icon2.png";
import icon3 from "@/public/assets/icon3.png";
import icon4 from "@/public/assets/icon4.png";
import icon5 from "@/public/assets/icon5.png";

export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  summary: () => [...DASHBOARD_QUERY_KEYS.all, "summary"] as const,
} as const;

export const useDashboardSummary = () => {
  const { data: session } = useSession();
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.summary(),
    queryFn: () => dashboardApi.getAdminSummary(session?.accessToken || ""),
    select: (data) => data.data, // Extract the data object from the response
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Helper hook to format dashboard data for StatCards
export const useFormattedDashboardStats = () => {
  const { data, ...queryResult } = useDashboardSummary();

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formattedStats = data
    ? [
        {
          title: "Total Revenue",
          value: formatNumber(data.totalRevenue),
          icon: icon1,
          iconColor: "text-blue-600",
          iconBgColor: "bg-blue-100",
        },
        {
          title: "Product Request",
          value: formatNumber(data.totalProductRequests),
          icon: icon2,
          iconColor: "text-green-600",
          iconBgColor: "bg-green-100",
        },
        {
          title: "Live Product",
          value: formatNumber(data.totalLiveProducts),
          icon: icon3,
          iconColor: "text-purple-600",
          iconBgColor: "bg-purple-100",
        },
        {
          title: "Total Company",
          value: formatNumber(data.totalCompanies),
          icon: icon4,
          iconColor: "text-orange-600",
          iconBgColor: "bg-orange-100",
        },
        {
          title: "Company Request",
          value: formatNumber(data.companyRequests),
          icon: icon5,
          iconColor: "text-blue-600",
          iconBgColor: "bg-blue-100",
        },
      ]
    : [];

  return {
    stats: formattedStats,
    rawData: data,
    ...queryResult,
  };
};
