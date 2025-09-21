// services/dashboardApi.ts

import { DashboardSummaryResponse } from "../types/dashboard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "{{ftfdesignco}}";

export const dashboardApi = {
  async getAdminSummary(token:string): Promise<DashboardSummaryResponse> {
    const response = await fetch(`${API_BASE_URL}/dashboard/admin-summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed
        'Authorization': `Bearer ${token}`,
      },
      // Add credentials if needed for authentication
      // credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch dashboard summary: ${response.statusText}`
      );
    }

    const data: DashboardSummaryResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch dashboard data");
    }

    return data;
  },
};
