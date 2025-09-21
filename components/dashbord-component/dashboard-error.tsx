// components/dashboard-component/dashboard-error.tsx
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface DashboardErrorProps {
  error: Error;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function DashboardError({
  error,
  onRetry,
  isRetrying = false,
}: DashboardErrorProps) {
  return (
    <Card className="!bg-red-50 !border-red-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900">
              Failed to load dashboard data
            </h3>
            <p className="text-red-700 mt-1">
              {error.message ||
                "Something went wrong while fetching the dashboard summary."}
            </p>
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
              />
              {isRetrying ? "Retrying..." : "Retry"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
