"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  History,
  Users,
  FileText,
  DollarSign,
  Coins,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Products List",
    href: "/product", 
    icon: Package,
  },
  {
    name: "Requested for Products",
    href: "/dashboard/requested-prodicts",
    icon: FileText,
  },
  {
    name: "Order History",
    href: "/dashboard/orders",
    icon: History,
  },
  {
    name: "Employee Profile",
    href: "/dashboard/employees",
    icon: Users,
  },

  {
    name: "My Sales",
    href: "/dashboard/sales",
    icon: DollarSign,
  },
  {
    name: "Company Coins",
    href: "/dashboard/coins",
    icon: Coins,
  },
  {
    name: "Setting",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#035F8A] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/logo.png"
              alt="GratiSwag Logo"
              width={104}
              height={64}
              className="h-10 w-auto sm:h-12 lg:h-16"
              priority
            />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          return (
            <Link
              key={item.name}
              href={item.href} 
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-[#D9AD5E] hover:bg-[#D9AD5E] text-white"
                  : "text-gray-300 hover:bg-[#EFA610] hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-300 hover:bg-[#2a6b7d] hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
