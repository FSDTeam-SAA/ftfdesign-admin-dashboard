"use client";

import NewProductsChart from "@/components/dashbord-component/new-products-chart";
import { ProductSellChart } from "@/components/dashbord-component/product-sell-Chart";
// import { RevenueRatioChart } from "@/components/dashbord-component/revenue-ratio-chart";
import { RevenueReportChart } from "@/components/dashbord-component/revenue-report-chart";
import { StatCard } from "@/components/dashbord-component/stat-card";
import { StatCardsSkeleton } from "@/components/dashbord-component/stat-card-skeleton";
import { DashboardError } from "@/components/dashbord-component/dashboard-error";
import { useFormattedDashboardStats } from "@/hooks/useDashboard";

export default function Dashboard() {
  const { stats, isLoading, error, refetch, isRefetching } =
    useFormattedDashboardStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#131313]">Overview</h1>
          <p className="text-base text-[#929292] mt-3">Dashboard</p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <StatCardsSkeleton />
        ) : error ? (
          <DashboardError
            error={error}
            onRetry={() => refetch()}
            isRetrying={isRefetching}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <StatCard
                key={`${stat.title}-${index}`}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconColor={stat.iconColor}
                iconBgColor={stat.iconBgColor}
              />
            ))}
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <RevenueRatioChart /> */}
          <NewProductsChart />
          <ProductSellChart />
        </div>

        <RevenueReportChart />
      </div>
    </div>
  );
}
