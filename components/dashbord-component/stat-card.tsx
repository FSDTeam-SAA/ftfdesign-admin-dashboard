// components/dashboard-component/stat-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { StatCardData } from "@/types/dashboard";

type StatCardProps = StatCardData;

export function StatCard({
  title,
  value,
  icon,
  iconColor,
  iconBgColor,
}: StatCardProps) {
  console.log(icon);
  return (
    <Card className="!bg-transparent !shadow-none">
      <CardContent className="p-4 h-[120px]">
        <div className="flex items-center gap-x-[32px]">
          <div>
            <p className="text-xl font-bold text-[#131313]">{title}</p>
            <p className="text-[18px] font-semibold text-[#424242] mt-2">
              {value}
            </p>
          </div>
          <div
            className={`h-[54px] w-[54px] ${iconBgColor} rounded-lg flex items-center justify-center`}
          >
            <Image
              src={icon}
              alt={`${title} icon`}
              width={24}
              height={24}
              className={iconColor}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
