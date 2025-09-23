"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  X,
  Calendar,
  
  Building2,
  Package,
  Coins,
} from "lucide-react";
import { useSession } from "next-auth/react";

// Type definitions
interface Product {
  title: string;
  totalQuantity: number;
  totalCoin: number;
  companyName: string;
}

interface PaymentHistory {
  companyName: string;
  amount: number;
  createdAt: string;
  createdAtFormatted: string;
  transactionId: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    totalRevenue: number;
    products: Product[];
    paymentHistory: PaymentHistory[];
  };
}

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentDetailsModalProps {
  payment: PaymentHistory | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "products" | "payments";

// API function
const fetchTotalRevenue = async (token: string): Promise<ApiResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payment/total-revenue`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch revenue data");
  }
  return response.json();
};

// Product Details Modal Component
const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Product Details
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Product Title</p>
                <p className="font-medium text-gray-900">{product.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="font-medium text-gray-900">
                  {product.companyName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">Total Quantity</p>
                <p className="font-medium text-gray-900">
                  {product.totalQuantity} units
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Coins className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="font-medium text-gray-900">
                  ${product.totalCoin}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <Button
              onClick={onClose}
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Details Modal Component
const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Payment Details
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="font-medium text-gray-900">
                  {payment.companyName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Coins className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-gray-900">${payment.amount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* <CreditCard className="h-5 w-5 text-purple-600" /> */}
              {/* <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-medium text-gray-900 break-all">
                  {payment.transactionId}
                </p>
              </div> */}
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {payment.createdAtFormatted}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <Button
              onClick={onClose}
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const MyWalletDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(
    null
  );

  const { data: session } = useSession();
  const token = session?.accessToken || "";
  console.log(session);
  const itemsPerPage = 5;

  // Fetch data using TanStack Query
  const { data, isLoading, error, refetch } = useQuery<ApiResponse, Error>({
    queryKey: ["totalRevenue"],
    queryFn: () => fetchTotalRevenue(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Filter and paginate products
  const filteredProducts = useMemo<Product[]>(() => {
    if (!data?.data?.products) return [];
    return data.data.products.filter(
      (product: Product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.data?.products, searchTerm]);

  // Filter and paginate payment history
  const filteredPayments = useMemo<PaymentHistory[]>(() => {
    if (!data?.data?.paymentHistory) return [];
    return data.data.paymentHistory.filter(
      (payment: PaymentHistory) =>
        payment.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.data?.paymentHistory, searchTerm]);

  const currentItems = useMemo(() => {
    return activeTab === "products" ? filteredProducts : filteredPayments;
  }, [activeTab, filteredProducts, filteredPayments]);

  const totalPages = Math.ceil(currentItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = currentItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset pagination when switching tabs or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const handleReset = (): void => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab);
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchTerm(event.target.value);
  };

  const handleProductDetailsClick = (product: Product): void => {
    setSelectedProduct(product);
  };

  const handlePaymentDetailsClick = (payment: PaymentHistory): void => {
    setSelectedPayment(payment);
  };

  const closeProductModal = (): void => {
    setSelectedProduct(null);
  };

  const closePaymentModal = (): void => {
    setSelectedPayment(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading wallet data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-600 mb-4">
            Failed to load wallet data: {error.message}
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                My Wallet
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <span>Dashboard</span>
                <span>›</span>
                <span>My Wallet</span>
              </div>
            </div>
            {/* <Button className="bg-orange-400 hover:bg-orange-500 text-white">
            Withdraw
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button> */}
          </div>

          {/* Revenue Card */}
        </div>
          <div className="bg-[#035F8A] rounded-lg p-6 text-white mb-8 max-w-[470px] w-full">
            <h2 className="text-lg font-medium mb-2">Total Revenue</h2>
            <p className="text-3xl font-bold">
              ${data?.data?.totalRevenue ?? 0}
            </p>
          </div>

        {/* Tab Navigation */}
        <div className="mb-4">
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => handleTabChange("products")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "products"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Products ({data?.data?.products?.length ?? 0})
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("payments")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "payments"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Payment History ({data?.data?.paymentHistory?.length ?? 0})
            </button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {activeTab === "products"
                ? "Products History"
                : "Payment History"}
            </h3>
            <div className="flex items-center gap-4">
              <Input
                placeholder={`Search ${activeTab}...`}
                className="max-w-xs"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  {activeTab === "products" ? (
                    <>
                      <th className="px-6 py-4 text-left text-base font-bold text-[#131313]">
                        Product Title
                      </th>
                      <th className="px-6 py-4 text-left text-base font-bold text-[#131313]">
                        Company
                      </th>
                      <th className="px-6 py-4 text-center text-base font-bold text-[#131313]">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-right text-base font-bold text-[#131313]">
                        Revenue
                      </th>
                      <th className="px-6 py-4 text-center text-base font-bold text-[#131313]">
                        Action
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-left text-base font-bold text-[#131313]">
                        Company
                      </th>
                      {/* <th className="px-6 py-4 text-left text-base font-bold text-[#131313]">
                        Transaction ID
                      </th> */}
                      <th className="px-6 py-4 text-right text-base font-bold text-[#131313]">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-center text-base font-bold text-[#131313]">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-base font-bold text-[#131313]">
                        Action
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item, index) => (
                    <tr
                      key={`${activeTab}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      {activeTab === "products" ? (
                        <>
                          <td className="px-6 py-4 text-base text-[#131313]">
                            {(item as Product).title}
                          </td>
                          <td className="px-6 py-4 text-base text-[#131313]">
                            {(item as Product).companyName}
                          </td>
                          <td className="px-6 py-4 text-base text-[#131313] text-center">
                            {(item as Product).totalQuantity}
                          </td>
                          <td className="px-6 py-4 text-base text-[#131313] text-right">
                            ${(item as Product).totalCoin}
                          </td>
                          <td className="px-6 py-4 text-center flex justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleProductDetailsClick(item as Product)
                              }
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Details
                            </Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 text-base text-[#131313]">
                            {(item as PaymentHistory).companyName}
                          </td>
                          {/* <td className="px-6 py-4 text-[#131313] font-mono text-xs">
                            {(item as PaymentHistory)?.transactionId.slice(
                              0,
                              20
                            )}
                            ...
                          </td> */}
                          <td className="px-6 py-4 text-base text-[#131313] text-right">
                            ${(item as PaymentHistory).amount}
                          </td>
                          <td className="px-6 py-4 text-base text-[#131313] text-center">
                            {(item as PaymentHistory).createdAtFormatted}
                          </td>
                          <td className="px-6 py-4 text-center flex justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handlePaymentDetailsClick(
                                  item as PaymentHistory
                                )
                              }
                              className="flex items-center gap-1 "
                            >
                              <Eye className="h-3 w-3" />
                              Details
                            </Button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No {activeTab} found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, currentItems.length)} of{" "}
                {currentItems.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={closeProductModal}
      />

      <PaymentDetailsModal
        payment={selectedPayment}
        isOpen={!!selectedPayment}
        onClose={closePaymentModal}
      />
    </div>
  );
};

export default MyWalletDashboard;
