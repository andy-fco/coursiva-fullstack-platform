"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import CategoryCard from "@/components/CategoryCard";

type Category = {
  id: number;
  name: string;
  description: string;
  coursesCount?: number;
};

type Course = {
  id: number;
  title: string;
  description: string;
  durationHours: number;
  category: Category;
};

export default function StudentDashboardPage() {
  const { user, token } = useAuthContext();
  const router = useRouter();

  const [latestCourses, setLatestCourses] = useState<Course[]>([]);
  const [popularCategories, setPopularCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const coursesRes = await fetch(
          "http://localhost:4000/courses?limit=6&order=desc",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const categoriesRes = await fetch("http://localhost:4000/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const coursesData = await coursesRes.json();
        const categoriesData = await categoriesRes.json();

        const sortedCourses = [...coursesData]
          .sort((a, b) => b.id - a.id)
          .slice(0, 6);

        setLatestCourses(sortedCourses);

        const sortedCategories = [...categoriesData]
          .sort((a, b) => (b.coursesCount || 0) - (a.coursesCount || 0))
          .slice(0, 3);

        setPopularCategories(sortedCategories);
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              Bienvenido{user?.email ? `, ${user.email}` : ""}
            </h1>
            <p className="text-sm text-gray-600">
              Explorá contenido nuevo y seguí aprendiendo a tu ritmo.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Lo más nuevo en <span className="italic">Cursiva</span>
            </h2>

            {loading ? (
              <p className="text-sm text-gray-500">Cargando cursos...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Lo más popular entre los alumnos
            </h2>

            {loading ? (
              <p className="text-sm text-gray-500">Cargando categorías...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {popularCategories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    name={cat.name}
                    description={cat.description}
                    onClick={() => router.push(`/courses?category=${cat.id}`)}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <div
              onClick={() => router.push("/profile")}
              className="
                cursor-pointer bg-violet-700 text-white rounded-xl p-6
                flex items-center justify-between transition
                hover:bg-violet-800 hover:scale-[1.01]
              "
            >
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Seguí aprendiendo</h3>
                <p className="text-sm text-violet-100">
                  Volvé a tus cursos y continuá desde donde lo dejaste.
                </p>
              </div>

              <span className="font-medium">Ir a mi perfil →</span>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
