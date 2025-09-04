"use client"

import { NewProductsChart } from "@/components/dashbord-component/new-products-chart"
import { ProductSellChart } from "@/components/dashbord-component/product-sell-Chart"
import { RevenueRatioChart } from "@/components/dashbord-component/revenue-ratio-chart"
import { RevenueReportChart } from "@/components/dashbord-component/revenue-report-chart"
import { StatCard } from "@/components/dashbord-component/stat-card"



export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#131313]">Overview</h1>
          <p className="text-base text-[#929292] mt-3">Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Revenue"
            value="132,570"
            icon="/assets/icon1.png"
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatCard
            title="Product Request"
            value="10000"
            icon="/assets/icon2.png"
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          />
          <StatCard
            title="Live Product"
            value="132,570"
             icon="/assets/icon3.png"
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
          />
          <StatCard
            title="Total Company"
            value="132,570"
           icon="/assets/icon4.png"
            iconColor="text-orange-600"
            iconBgColor="bg-orange-100"
          />
          <StatCard
            title="Company Request"
            value="2329"
          icon="/assets/icon5.png"
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RevenueRatioChart />
          <NewProductsChart />
          <ProductSellChart />
        </div>

        <RevenueReportChart />
      </div>
    </div>
  )
}
