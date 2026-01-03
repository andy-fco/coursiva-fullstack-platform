"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEnrollments } from "@/hooks/useEnrollments";
import CourseCard from "@/components/CourseCard";
import ConfirmModal from "@/components/ConfirmModal";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const { enrollments, loading } = useEnrollments();

  const [openLogout, setOpenLogout] = useState(false);

  const ongoing = enrollments.filter((e) => !e.completed);
  const completed = enrollments.filter((e) => e.completed);

  const confirmLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">Mi perfil</h1>

            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-medium">Rol:</span> Student
              </p>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Mis cursos</h2>

            {loading ? (
              <p className="text-sm text-gray-500">Cargando cursos...</p>
            ) : (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800">En curso</h3>

                  {ongoing.length === 0 ? (
                    <p className="text-sm text-gray-600">
                      No hay cursos en progreso.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ongoing.map((e) => (
                        <CourseCard key={e.id} course={e.course} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800">Completados</h3>

                  {completed.length === 0 ? (
                    <p className="text-sm text-gray-600">
                      No hay cursos completados.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {completed.map((e) => (
                        <CourseCard key={e.id} course={e.course} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="flex justify-end">
            <button
              onClick={() => setOpenLogout(true)}
              className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition"
            >
              Cerrar sesión
            </button>
          </section>
        </div>

        <ConfirmModal
          open={openLogout}
          title="Cerrar sesión"
          message="¿Estás seguro de que querés cerrar sesión?"
          onCancel={() => setOpenLogout(false)}
          onConfirm={confirmLogout}
        />
      </main>
    </ProtectedRoute>
  );
}
