"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
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
  categoryId: number;
};

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthContext();

  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseRes, categoriesRes] = await Promise.all([
          fetch(`http://localhost:4000/courses/admin/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:4000/categories"),
        ]);

        if (!courseRes.ok || !categoriesRes.ok) {
          throw new Error();
        }

        const course: Course = await courseRes.json();
        const cats: Category[] = await categoriesRes.json();

        setTitle(course.title);
        setDescription(course.description);
        setDurationHours(String(course.durationHours));
        setCategoryId(String(course.categoryId));
        setPublished(course.published);
        setCategories(cats);
      } catch {
        setError("No se pudo cargar el curso");
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !durationHours || !categoryId) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const hours = Number(durationHours);
    if (isNaN(hours) || hours <= 0) {
      setError("La duración debe ser válida");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`http://localhost:4000/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          durationHours: hours,
          categoryId: Number(categoryId),
          published,
        }),
      });

      if (!res.ok) throw new Error();

      router.push("/admin/courses");
    } catch {
      setError("No se pudo actualizar el curso");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <main className="min-h-screen bg-violet-950 px-6 py-10">
        <div className="max-w-xl mx-auto space-y-8">
          <h1 className="text-2xl font-semibold text-white">Editar curso</h1>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {loading ? (
            <p className="text-sm text-violet-300">Cargando curso...</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-violet-900 border border-violet-800 rounded-xl p-6 space-y-5"
            >
              <div className="space-y-1">
                <label className="text-sm text-violet-200">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="
                    w-full rounded-lg bg-violet-950 border border-violet-800
                    px-4 py-2.5 text-sm text-white
                    focus:outline-none focus:ring-2 focus:ring-violet-600
                  "
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-violet-200">Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="
                    w-full rounded-lg bg-violet-950 border border-violet-800
                    px-4 py-2.5 text-sm text-white resize-none
                    focus:outline-none focus:ring-2 focus:ring-violet-600
                  "
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-violet-200">
                  Duración (horas)
                </label>
                <input
                  type="number"
                  min={1}
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  className="
                    w-full rounded-lg bg-violet-950 border border-violet-800
                    px-4 py-2.5 text-sm text-white
                    focus:outline-none focus:ring-2 focus:ring-violet-600
                  "
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-violet-200">Categoría</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="
                    w-full rounded-lg bg-violet-950 border border-violet-800
                    px-4 py-2.5 text-sm text-white
                    focus:outline-none focus:ring-2 focus:ring-violet-600
                  "
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 text-sm text-violet-200">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="accent-violet-600"
                />
                Publicado
              </label>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/admin/courses")}
                  className="px-4 py-2 rounded-full border border-violet-600 text-violet-200 hover:bg-violet-800 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-full bg-violet-700 hover:bg-violet-600 text-white font-medium transition disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
