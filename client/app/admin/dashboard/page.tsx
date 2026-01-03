import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requireAdmin>
      <main className="min-h-screen bg-violet-950 px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-white">
              Panel de administración
            </h1>
            <p className="text-sm text-violet-200">
              Gestioná el contenido de la plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/admin/courses"
              className="
                bg-violet-900 border border-violet-800 rounded-xl p-6
                flex flex-col justify-between
                text-left cursor-pointer transition
                hover:bg-violet-800 hover:scale-[1.02]
              "
            >
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-white">
                  Gestionar cursos
                </h2>
                <p className="text-sm text-violet-200">
                  Crear, editar y eliminar cursos disponibles
                </p>
              </div>

              <span className="text-sm font-medium text-violet-300">
                Ir a cursos →
              </span>
            </Link>

            <Link
              href="/admin/categories"
              className="
                bg-violet-900 border border-violet-800 rounded-xl p-6
                flex flex-col justify-between
                text-left cursor-pointer transition
                hover:bg-violet-800 hover:scale-[1.02]
              "
            >
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-white">
                  Gestionar categorías
                </h2>
                <p className="text-sm text-violet-200">
                  Administrar las categorías de los cursos
                </p>
              </div>

              <span className="text-sm font-medium text-violet-300">
                Ir a categorías →
              </span>
            </Link>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
