import { StaticImageData } from "next/image";

// types/dashboard.ts
export interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: DashboardSummaryData;
}

export interface DashboardSummaryData {
  totalRevenue: number;
  totalLiveProducts: number;
  totalCompanies: number;
  totalProductRequests: number;
  companyRequests: number;
}

export interface StatCardData {
  title: string;
  value: string;
  icon: string | StaticImageData;
  iconColor: string;
  iconBgColor: string;
}
