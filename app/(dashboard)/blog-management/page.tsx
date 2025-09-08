"use client"

import { useState } from "react"
import { BlogList } from "./_components/Blog-list"
import { AddBlogForm } from "./_components/Add-blog-form"


export default function BlogManagement() {
  const [currentView, setCurrentView] = useState<"list" | "add">("list")

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "list" ? (
        <BlogList onAddBlog={() => setCurrentView("add")} />
      ) : (
        <AddBlogForm onBack={() => setCurrentView("list")} />
      )}
    </div>
  )
}
