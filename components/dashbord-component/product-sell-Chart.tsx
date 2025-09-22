import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

// API Response Types
interface CategoryData {
  category: string;
  percentage: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: CategoryData[];
}

// Chart Data Types
interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

// Define color palette for categories
const COLORS: readonly string[] = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#eab308",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
] as const;

// API function to fetch product sell category report
const fetchProductSellReport = async (
  token: string
): Promise<CategoryData[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/admin-sell-category-report`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch data");
  }

  return result.data;
};

// Transform API data to chart format
const transformDataForChart = (apiData: CategoryData[]): ChartDataItem[] => {
  return apiData.map((item, index) => ({
    name: item.category,
    value: parseFloat(item.percentage.replace("%", "")),
    color: COLORS[index % COLORS.length] as string,
  }));
};

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

// Error State Component
interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => (
  <div className="text-center">
    <p className="text-red-600 mb-2">Failed to load data</p>
    <button
      onClick={onRetry}
      className="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      type="button"
    >
      Try Again
    </button>
  </div>
);

// Empty State Component
const EmptyState: React.FC = () => (
  <div className="text-center text-gray-500">No data available</div>
);

// Legend Item Component
interface LegendItemProps {
  item: ChartDataItem;
  index: number;
}

const LegendItem: React.FC<LegendItemProps> = ({ item, index }) => (
  <div key={index} className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: item.color }}
        aria-hidden="true"
      />
      <span className="text-sm text-gray-600">
        {item.name} {item.value}%
      </span>
    </div>
  </div>
);

// Main Component
export function ProductSellChart(): JSX.Element {
  const { data: session } = useSession();
  const {
    data: apiData = [],
    isLoading,
    error,
    refetch,
  } = useQuery<CategoryData[], Error>({
    queryKey: ["productSellCategoryReport"],
    queryFn: () => fetchProductSellReport(session?.accessToken || ""),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const chartData: ChartDataItem[] = transformDataForChart(apiData);

  const handleRefresh = (): void => {
    void refetch();
  };

  if (error) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Product Sell
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-64 flex items-center justify-center">
            <ErrorState onRetry={handleRefresh} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Product Sell
          </CardTitle>
          {/* <button
            onClick={handleRefresh}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            type="button"
            aria-label={isLoading ? "Refreshing data" : "Refresh data"}
          >
            {isLoading ? "Refreshing..." : "View Details"}
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button> */}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64 flex items-center justify-center relative">
          {isLoading ? (
            <LoadingSpinner />
          ) : chartData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {!isLoading && chartData.length > 0 && (
          <div className="mt-6 space-y-3">
            {chartData.map((item, index) => (
              <LegendItem key={`legend-${index}`} item={item} index={index} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
