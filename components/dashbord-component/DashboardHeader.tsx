"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function DashboardHeader() {
 
  return (
    <header className="bg-[#035F8A] border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">{ "Mr. Raja"}</span>
          <Avatar className="h-8 w-8">
            <AvatarImage src={ ""} />
            <AvatarFallback>MR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
