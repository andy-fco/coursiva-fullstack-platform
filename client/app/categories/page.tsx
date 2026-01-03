"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import CategoryCard from "@/components/CategoryCard";

type Category = {
  id: number;
  name: string;
  description: string;
};

export default function CategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/categories");

        if (!res.ok) throw new Error();

        setCategories(await res.json());
      } catch {
        setError("No se pudieron cargar las categorías");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-2xl font-semibold text-gray-900">Categorías</h1>

          {loading && (
            <p className="text-sm text-gray-500">Cargando categorías...</p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && categories.length === 0 && (
            <p className="text-sm text-gray-600">
              No hay categorías disponibles.
            </p>
          )}

          {!loading && categories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  description={category.description}
                  onClick={() =>
                    router.push(`/courses?category=${category.id}`)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
