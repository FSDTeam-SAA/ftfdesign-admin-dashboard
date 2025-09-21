import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSession } from "next-auth/react";

// API function to fetch revenue report
const fetchRevenueReport = async (filterBy: string, token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/admin-revenue-report?filterBy=${filterBy}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch revenue report");
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch revenue data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching revenue report:", error);
    throw error;
  }
};

export function RevenueReportChart() {
  const [filterBy, setFilterBy] = useState("year");

  const { data: session } = useSession();
  // TanStack Query hook
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["revenue-report", filterBy],
    queryFn: () => fetchRevenueReport(filterBy, session?.accessToken || ""),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Transform API data to chart format
  const transformedData = React.useMemo(() => {
    if (!data?.data) return [];

    const responseData = data.data;
    const { labels } = responseData;

    // Ensure labels exist before mapping
    if (!labels || !Array.isArray(labels)) return [];

    // Check if it's year filter (has thisYear/lastYear) or other filters (has single data array)
    if (filterBy === "year" && responseData.thisYear && responseData.lastYear) {
      // Year filter format
      return labels.map((label, index) => ({
        month: label,
        thisYear: (responseData.thisYear && responseData.thisYear[index]) || 0,
        lastYear: (responseData.lastYear && responseData.lastYear[index]) || 0,
      }));
    } else if (responseData.data && Array.isArray(responseData.data)) {
      // Day/Week/Month filter format - only show current data
      return labels.map((label, index) => ({
        month: label,
        thisYear: responseData.data[index] || 0,
        lastYear: 0, // No comparison data for these filters
      }));
    }

    return [];
  }, [data, filterBy]);

  const filterOptions = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  if (isError) {
    return (
      <Card className="!bg-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64 text-red-500">
            Error loading revenue data: {error?.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="!bg-transparent">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[24px] text-[#131313] font-bold">
            Revenue report
          </CardTitle>

          {/* <div className="flex gap-5">
            <div className="flex items-center gap-1 text-xs border p-2 rounded-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-[#424242]">
                {filterBy === "year" ? "This Year" : "Current"}
              </span>
            </div>
            {filterBy === "year" && (
              <div className="flex items-center gap-1 text-xs border p-2 rounded-md">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-gray-600">Last Year</span>
              </div>
            )}
          </div> */}

          <div className="flex items-center gap-4">
            {/* Filter Dropdown */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* <button className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors">
              Save
            </button> */}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-64">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transformedData} barCategoryGap="20%">
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                />
                <Bar
                  dataKey="thisYear"
                  fill="#1059EF"
                  radius={[10, 10, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
