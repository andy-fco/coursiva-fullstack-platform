"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthContext } from "@/context/AuthContext";

export default function NewCategoryPage() {
  const router = useRouter();
  const { token } = useAuthContext();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !description.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) throw new Error();

      router.push("/admin/categories");
    } catch {
      setError("No se pudo crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <main className="min-h-screen bg-violet-950 px-6 py-10">
        <div className="max-w-xl mx-auto space-y-8">
          <h1 className="text-2xl font-semibold text-white">Crear categoría</h1>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <form
            onSubmit={handleSubmit}
            className="bg-violet-900 border border-violet-800 rounded-xl p-6 space-y-5"
          >
            <div className="space-y-1">
              <label className="text-sm text-violet-200">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/admin/categories")}
                className="px-4 py-2 rounded-full border border-violet-600 text-violet-200 hover:bg-violet-800 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-full bg-violet-700 hover:bg-violet-600 text-white font-medium transition disabled:opacity-50"
              >
                Crear
              </button>
            </div>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}
