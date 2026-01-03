"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ConfirmModal from "@/components/ConfirmModal";
import { useAuthContext } from "@/context/AuthContext";

type Category = {
  id: number;
  name: string;
  description: string;
};

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { token } = useAuthContext();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch(
        `http://localhost:4000/categories/${selectedId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      setCategories((prev) => prev.filter((c) => c.id !== selectedId));
    } catch {
      setError("No se pudo eliminar la categoría");
    } finally {
      setOpenConfirm(false);
      setSelectedId(null);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <main className="min-h-screen bg-violet-950 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Categorías</h1>

            <button
              onClick={() => router.push("/admin/categories/new")}
              className="px-5 py-2 rounded-full bg-violet-700 hover:bg-violet-600 text-white font-medium transition"
            >
              Crear categoría
            </button>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {loading && (
            <p className="text-sm text-violet-300">Cargando categorías...</p>
          )}

          {!loading && categories.length === 0 && (
            <p className="text-sm text-violet-300">
              No hay categorías creadas.
            </p>
          )}

          {!loading && categories.length > 0 && (
            <div className="bg-violet-900 border border-violet-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-violet-900">
                  <tr className="text-left text-violet-200">
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Descripción</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-t border-violet-800 text-violet-100"
                    >
                      <td className="p-4 font-medium">{cat.name}</td>
                      <td className="p-4 text-violet-300">{cat.description}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() =>
                              router.push(`/admin/categories/${cat.id}/edit`)
                            }
                            className="px-3 py-1 rounded-full border border-violet-600 text-violet-200 hover:bg-violet-800 transition"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => openDeleteModal(cat.id)}
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
            title="Eliminar categoría"
            message="Esta acción no se puede deshacer."
            onConfirm={handleDelete}
            onCancel={() => setOpenConfirm(false)}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}
