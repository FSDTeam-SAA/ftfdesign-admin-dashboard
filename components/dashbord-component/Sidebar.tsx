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
 PackageSearch ,
  Coins,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpenText 
} from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Categories",
    href: "/category",
    icon: Package,
  },
  {
    name: "Live Products",
    href: "/live-products",
    icon: FileText,
  },
  {
    name: "Order History",
    href: "/order-history",
    icon: History,
  },
  {
    name: "Company Request",
    href: "/company-request",
    icon: Users,
  },
  {
    name: "Request for Products",
    href: "/request-for-products",
    icon: PackageSearch ,
  },
  {
    name: "My Wallet",
    href: "/my-wallet",
    icon: Coins,
  },
  {
    name: "Blog Management",
    href: "/dashboard/settings",
    icon: BookOpenText ,
  },
  {
    name: "Company Profile",
    href: "/company-profile",
    icon: Users ,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => {
    setIsModalOpen(false);
    signOut({ callbackUrl: "/login" });
  };

  const cancelLogout = () => {
    setIsModalOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#035F8A] text-white pt-3">
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
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-300 hover:bg-[#EFA610] hover:text-white"
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

      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900">Confirm Logout</h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={cancelLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmLogout}
                className="bg-[#035F8A] hover:bg-[#EFA610] text-white"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}