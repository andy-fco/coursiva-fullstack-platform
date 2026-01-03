"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEnrollments } from "@/hooks/useEnrollments";

type Course = {
  id: number;
  title: string;
  description: string;
  durationHours: number;
  createdAt: string;
  category: {
    id: number;
    name: string;
  };
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { enroll, cancel, complete, getEnrollmentByCourse } = useEnrollments();
  const enrollment = course ? getEnrollmentByCourse(course.id) : null;
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:4000/courses/${id}`);
        if (!res.ok) throw new Error();
        setCourse(await res.json());
      } catch {
        setError("Curso no encontrado");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-violet-700 hover:text-violet-800 transition"
          >
            ← Volver
          </button>

          {loading && (
            <p className="text-sm text-gray-500">Cargando curso...</p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && course && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 shadow-sm">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {course.category.name} · {course.durationHours} horas
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {course.description}
              </p>

              {actionError && (
                <p className="text-sm text-red-600">{actionError}</p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                {!enrollment && (
                  <button
                    onClick={async () => {
                      try {
                        setActionError("");
                        await enroll(course.id);
                      } catch (e: any) {
                        setActionError(e.message);
                      }
                    }}
                    className="px-5 py-2 rounded-full bg-violet-700 hover:bg-violet-800 text-white font-medium transition"
                  >
                    Inscribirme
                  </button>
                )}

                {enrollment?.completed && (
                  <div className="px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm">
                    Curso completado
                  </div>
                )}

                {enrollment && !enrollment.completed && (
                  <>
                    <button
                      onClick={async () => {
                        try {
                          setActionError("");
                          await complete(enrollment.id);
                        } catch (e: any) {
                          setActionError(e.message);
                        }
                      }}
                      className="px-5 py-2 rounded-full bg-violet-700 hover:bg-violet-800 text-white font-medium transition"
                    >
                      Marcar como completado
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          setActionError("");
                          await cancel(enrollment.id);
                        } catch (e: any) {
                          setActionError(e.message);
                        }
                      }}
                      className="px-5 py-2 rounded-full border border-red-600 text-red-600 hover:bg-red-50 font-medium transition"
                    >
                      Cancelar inscripción
                    </button>
                  </>
                )}

                {enrollment && enrollment.completed && (
                  <button
                    onClick={async () => {
                      try {
                        setActionError("");
                        await cancel(enrollment.id);
                      } catch (e: any) {
                        setActionError(e.message);
                      }
                    }}
                    className="px-5 py-2 rounded-full border border-red-600 text-red-600 hover:bg-red-50 font-medium transition"
                  >
                    Cancelar inscripción
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
