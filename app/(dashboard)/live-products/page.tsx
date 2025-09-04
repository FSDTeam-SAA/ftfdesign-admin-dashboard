import Link from "next/link"

export default function HomePage() {
  const products = [
    { id: 1, name: "Adidas", category: "T-Shirt", price: "$500", quantity: 100, date: "04/21/2025", time: "03:18pm" },
    { id: 2, name: "Adidas", category: "T-Shirt", price: "$500", quantity: 100, date: "04/21/2025", time: "03:18pm" },
    { id: 3, name: "Adidas", category: "T-Shirt", price: "$500", quantity: 100, date: "04/21/2025", time: "03:18pm" },
    { id: 4, name: "Adidas", category: "T-Shirt", price: "$500", quantity: 100, date: "04/21/2025", time: "03:18pm" },
    { id: 5, name: "Adidas", category: "T-Shirt", price: "$500", quantity: 100, date: "04/21/2025", time: "03:18pm" },
    { id: 6, name: "Adidas", category: "T-Shirt", price: "$500", quantity: 100, date: "04/21/2025", time: "03:18pm" },
    { id: 7, name: "Adidas", category: "T-Shirt", price: "$500", quantity: 100, date: "04/21/2025", time: "03:18pm" },
    { id: 8, name: "Adidas", category: "T-Shirt", price: "$500", quantity: 100, date: "04/21/2025", time: "03:18pm" },
    { id: 9, name: "Adidas", category: "T-Shirt", price: "$500", quantity: 100, date: "04/21/2025", time: "03:18pm" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className=" text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-bold text-[#131313]">Live Products</h1>
          <Link
            href="/live-products/add-product"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white px-6 py-3 border-b">
        <div className="flex items-center text-sm text-gray-600">
          <span>Dashboard</span>
          <span className="mx-2">›</span>
          <span>Live Products</span>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Product Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded flex items-center justify-center text-white text-xs font-bold">
                        BK
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{product.category}</td>
                  <td className="py-3 px-4 text-gray-600">{product.price}</td>
                  <td className="py-3 px-4 text-gray-600">{product.quantity}</td>
                  <td className="py-3 px-4 text-gray-600">
                    <div>
                      <div>{product.date}</div>
                      <div className="text-sm text-gray-500">{product.time}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/live-products/edit-product/${product.id}`} className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
