"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import ConfirmModal from "@/components/ConfirmModal";

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAdmin, loading } = useAuthContext();
  const [openLogout, setOpenLogout] = useState(false);

  if (loading) return null;

  const confirmLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold italic text-violet-700 hover:text-violet-800 transition"
        >
          Cursiva
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-violet-700 hover:text-violet-800 transition"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="border border-violet-700 text-violet-700 hover:bg-violet-50 px-4 py-1.5 rounded-full transition"
          >
            Registrarse
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`w-full px-6 py-4 flex items-center justify-between shadow-sm ${
          isAdmin ? "bg-violet-800" : "bg-violet-700"
        }`}
      >
        <Link
          href={isAdmin ? "/admin/dashboard" : "/dashboard"}
          className="text-lg font-semibold italic text-white hover:opacity-90 transition"
        >
          Cursiva
        </Link>

        <div className="flex items-center gap-6">
          {!isAdmin && (
            <>
              <Link
                href="/dashboard"
                className="text-white/90 hover:text-white transition"
              >
                Inicio
              </Link>
              <Link
                href="/categories"
                className="text-white/90 hover:text-white transition"
              >
                Categorías
              </Link>
              <Link
                href="/courses"
                className="text-white/90 hover:text-white transition"
              >
                Cursos
              </Link>
              <Link
                href="/profile"
                className="text-white/90 hover:text-white transition"
              >
                Perfil
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                href="/admin/dashboard"
                className="text-violet-100 hover:text-white transition"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/courses"
                className="text-violet-100 hover:text-white transition"
              >
                Cursos
              </Link>
              <Link
                href="/admin/categories"
                className="text-violet-100 hover:text-white transition"
              >
                Categorías
              </Link>

              <button
                onClick={() => setOpenLogout(true)}
                className="ml-4 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>

      <ConfirmModal
        open={openLogout}
        title="Cerrar sesión"
        message="¿Estás seguro de que querés cerrar sesión?"
        onCancel={() => setOpenLogout(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}
