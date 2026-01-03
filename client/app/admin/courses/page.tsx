"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ConfirmModal from "@/components/ConfirmModal";
import { useAuthContext } from "@/context/AuthContext";

type Category = {
  id: number;
  name: string;
};

type Course = {
  id: number;
  title: string;
  description: string;
  durationHours: number;
  published: boolean;
  category: Category;
};

export default function AdminCoursesPage() {
  const router = useRouter();
  const { token } = useAuthContext();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [order, setOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:4000/courses/admin", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:4000/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
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
  }, [token]);

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
        result.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        result.sort((a, b) => a.id - b.id);
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

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch(`http://localhost:4000/courses/${selectedId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      setCourses((prev) => prev.filter((c) => c.id !== selectedId));
    } catch {
      setError("No se pudo eliminar el curso");
    } finally {
      setOpenConfirm(false);
      setSelectedId(null);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <main className="min-h-screen bg-violet-950 px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Cursos</h1>

            <button
              onClick={() => router.push("/admin/courses/new")}
              className="px-5 py-2 rounded-full bg-violet-700 hover:bg-violet-600 text-white font-medium transition"
            >
              Crear curso
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                md:col-span-2 rounded-lg bg-violet-900 border border-violet-800
                px-4 py-2.5 text-sm text-white placeholder-violet-300
                focus:outline-none focus:ring-2 focus:ring-violet-600
              "
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="
                rounded-lg bg-violet-900 border border-violet-800
                px-4 py-2.5 text-sm text-white
                focus:outline-none focus:ring-2 focus:ring-violet-600
              "
            >
              <option value="">Todas</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="
                rounded-lg bg-violet-900 border border-violet-800
                px-4 py-2.5 text-sm text-white
                focus:outline-none focus:ring-2 focus:ring-violet-600
              "
            >
              <option value="newest">Más nuevos</option>
              <option value="oldest">Más viejos</option>
              <option value="shorter">Menor duración</option>
              <option value="longer">Mayor duración</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {loading && (
            <p className="text-sm text-violet-300">Cargando cursos...</p>
          )}

          {!loading && filteredCourses.length === 0 && (
            <p className="text-sm text-violet-300">
              No hay cursos que coincidan con los filtros.
            </p>
          )}

          {!loading && filteredCourses.length > 0 && (
            <div className="bg-violet-900 border border-violet-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-violet-900">
                  <tr className="text-left text-violet-200">
                    <th className="p-4">Título</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Duración</th>
                    <th className="p-4">Publicado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="border-t border-violet-800 text-violet-100"
                    >
                      <td className="p-4">{course.title}</td>
                      <td className="p-4">{course.category.name}</td>
                      <td className="p-4">{course.durationHours} hs</td>
                      <td className="p-4">{course.published ? "Sí" : "No"}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() =>
                              router.push(`/admin/courses/${course.id}/edit`)
                            }
                            className="px-3 py-1 rounded-full border border-violet-600 text-violet-200 hover:bg-violet-800 transition"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => openDeleteModal(course.id)}
                            className="px-3 py-1 rounded-full border border-red-500 text-red-400 hover:bg-red-900/30 transition"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <ConfirmModal
            open={openConfirm}
            title="Eliminar curso"
            message="Esta acción no se puede deshacer."
            onConfirm={handleDelete}
            onCancel={() => setOpenConfirm(false)}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}
