import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface StatCardProps {
  title: string
  value: string
  icon: string
  iconColor: string
  iconBgColor: string
}

export function StatCard({ title, value, icon, iconColor}: StatCardProps) {
  return (
    <Card className="!bg-transparent !shadow-none">
      <CardContent className="p-4 h-[120px]">
        <div className="flex items-center gap-x-[32px] ">
          <div>
            <p className="text-xl font-bold text-[#131313]">{title}</p>
            <p className="text-[18px] font-semibold text-[#424242] mt-2">{value}</p>
          </div>
          <div className={`h-[54px] w-[54px] ${iconColor}  rounded-lg flex items-center justify-center`}>
            <Image src={icon} alt="icon" width={100} height={100}  />
          </div>
        </div>
      </CardContent>
    </Card>
  ) 
}
