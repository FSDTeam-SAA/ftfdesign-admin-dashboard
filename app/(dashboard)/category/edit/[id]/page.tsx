'use client';

import { useQuery } from '@tanstack/react-query';
import { AddCategoryForm } from "@/components/dashbord-component/Add-category-form";
import { useSession } from 'next-auth/react';

interface Category {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
}

const fetchCategoryById = async (id: string, token?: string): Promise<Category> => {
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
  const { data: session } = useSession(); // Move useSession here
  const token = session?.accessToken;

  const { data: category, isLoading, error } = useQuery({
    queryKey: ['category', params.id],
    queryFn: () => fetchCategoryById(params.id, token), // Pass token to fetch function
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !category) {
    return <div>Category not found</div>;
  }

  console.log(category);
  return <AddCategoryForm initialData={category} isEdit={true} />;
}