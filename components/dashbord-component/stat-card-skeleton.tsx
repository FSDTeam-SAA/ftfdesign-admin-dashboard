// components/dashboard-component/stat-card-skeleton.tsx
import { Card, CardContent } from "@/components/ui/card";

export function StatCardSkeleton() {
  return (
    <Card className="!bg-transparent !shadow-none">
      <CardContent className="p-4 h-[120px]">
        <div className="flex items-center gap-x-[32px]">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="h-[54px] w-[54px] bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}
