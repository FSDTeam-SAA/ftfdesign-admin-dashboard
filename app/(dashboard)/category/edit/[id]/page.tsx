'use client';

import { useQuery } from '@tanstack/react-query';
import { AddCategoryForm } from "@/components/dashbord-component/Add-category-form";

interface Category {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
}

const fetchCategoryById = async (id: string): Promise<Category> => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFmOTM4NDVjMjlhOWViZTdiMjIzMjQiLCJlbWFpbCI6InNoYXllZEBnbWFpbC5jb20iLCJyb2xlIjoiY29tcGFueV9hZG1pbiIsImlhdCI6MTc1NjUwNjIwNywiZXhwIjoxNzU3MTExMDA3fQ.LF9dPckyQ7DApyEw6q5KhbwWwYdJA2ru0eoGlHXJgzA";
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }

  const result = await response.json();
  return {
    id: result.data._id,
    name: result.data.title,
    description: '', // API doesn't provide description, setting empty string
    thumbnail: result.data.thumbnail,
  };
};

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const { data: category, isLoading, error } = useQuery({
    queryKey: ['category', params.id],
    queryFn: () => fetchCategoryById(params.id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !category) {
    return <div>Category not found</div>;
  }
 console.log(category)
  return <AddCategoryForm initialData={category} isEdit={true} />;
}