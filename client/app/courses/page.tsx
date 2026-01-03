"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSearchParams } from "next/navigation";
import CourseCard from "@/components/CourseCard";

type Category = {
  id: number;
  name: string;
};

type Course = {
  id: number;
  title: string;
  description: string;
  durationHours: number;
  createdAt: string;
  category: Category;
};

export default function CoursesPage() {
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [order, setOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:4000/courses"),
          fetch("http://localhost:4000/categories"),
        ]);

        if (!coursesRes.ok || !categoriesRes.ok) throw new Error();

        setCourses(await coursesRes.json());
        setCategories(await categoriesRes.json());
      } catch {
        setError("No se pudieron cargar los cursos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) setCategoryFilter(categoryFromUrl);
  }, [searchParams]);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (categoryFilter) {
      result = result.filter((c) => String(c.category.id) === categoryFilter);
    }

    switch (order) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "shorter":
        result.sort((a, b) => a.durationHours - b.durationHours);
        break;
      case "longer":
        result.sort((a, b) => b.durationHours - a.durationHours);
        break;
    }

    return result;
  }, [courses, search, categoryFilter, order]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-2xl font-semibold text-gray-900">Cursos</h1>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {loading && (
            <p className="text-sm text-gray-500">Cargando cursos...</p>
          )}

          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    md:col-span-2
                    rounded-lg border border-gray-300 bg-white
                    px-4 py-2.5 text-sm text-gray-900
                    transition
                    focus:outline-none focus:ring-2 focus:ring-violet-700 focus:border-violet-700
                  "
                />

                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="
                      w-full appearance-none
                      rounded-lg border border-gray-300 bg-white
                      px-4 py-2.5 pr-10 text-sm text-gray-900
                      transition
                      hover:border-violet-500 hover:bg-violet-50
                      focus:outline-none focus:ring-2 focus:ring-violet-700 focus:border-violet-700
                    "
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-violet-600">
                    ▼
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="
                      w-full appearance-none
                      rounded-lg border border-gray-300 bg-white
                      px-4 py-2.5 pr-10 text-sm text-gray-900
                      transition
                      hover:border-violet-500 hover:bg-violet-50
                      focus:outline-none focus:ring-2 focus:ring-violet-700 focus:border-violet-700
                    "
                  >
                    <option value="newest">Más nuevos</option>
                    <option value="oldest">Más viejos</option>
                    <option value="shorter">Menor duración</option>
                    <option value="longer">Mayor duración</option>
                  </select>

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-violet-600">
                    ▼
                  </span>
                </div>
              </div>

              {filteredCourses.length === 0 && (
                <p className="text-sm text-gray-600">
                  No hay cursos que coincidan con los filtros.
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
