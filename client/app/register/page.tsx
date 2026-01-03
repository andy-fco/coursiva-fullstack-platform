"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("El email es obligatorio");
      return;
    }

    if (!email.includes("@")) {
      setError("El email no tiene un formato válido");
      return;
    }

    if (!password) {
      setError("La contraseña es obligatoria");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!confirmPassword) {
      setError("Debés repetir la contraseña");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar");
      }

      setSuccess("Usuario registrado correctamente. Redirigiendo...");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Error al registrar");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-violet-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-8 space-y-6 shadow-lg"
      >
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Crear cuenta</h1>
          <p className="text-sm text-gray-500">
            Registrate para comenzar a aprender
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg py-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-600 text-center bg-green-50 border border-green-200 rounded-lg py-2">
            {success}
          </p>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-700"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-700"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Repetir contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-700"
          />
        </div>

        <div className="flex flex-col items-end gap-3 pt-2">
          <button
            type="submit"
            className="bg-violet-700 hover:bg-violet-800 text-white font-medium px-10 py-2.5 rounded-full transition"
          >
            Crear cuenta
          </button>

          <p className="text-sm text-gray-500">
            ¿Ya tenés cuenta?{" "}
            <Link
              href="/login"
              className="text-violet-700 hover:text-violet-800 font-medium transition"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
