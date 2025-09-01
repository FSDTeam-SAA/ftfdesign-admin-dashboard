import { AddCategoryForm } from "@/components/dashbord-component/Add-category-form"


// Dummy data for editing
const getCategoryById = (id: string) => {
  const categories = [
    { id: 1, name: "T-Shirt", description: "Comfortable cotton t-shirts for everyday wear" },
    { id: 2, name: "Shirts", description: "Formal and casual shirts for all occasions" },
    { id: 3, name: "Pants & Shorts", description: "Comfortable bottoms for any season" },
    { id: 4, name: "Bag & Backpacks", description: "Stylish bags and backpacks for travel" },
    { id: 5, name: "Gifts", description: "Perfect gifts for your loved ones" },
  ]

  return categories.find((cat) => cat.id === Number.parseInt(id))
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = getCategoryById(params.id)

  if (!category) {
    return <div>Category not found</div>
  }

  return <AddCategoryForm initialData={category} isEdit={true} />
}
