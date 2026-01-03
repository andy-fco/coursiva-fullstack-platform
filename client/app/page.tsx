import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-violet-700 px-6">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-semibold text-white">
          Aprendé con <span className="italic font-bold">Cursiva</span>
        </h1>

        <p className="text-lg text-violet-100">
          Una plataforma donde el aprendizaje fluye. Encontrá cursos sobre
          tecnología, programación, fotografía y mucho más, pensados para
          aprender de forma clara, práctica y a tu ritmo.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="bg-white text-violet-700 hover:bg-violet-50 font-medium px-8 py-3 rounded-full transition"
          >
            Ingresar
          </Link>

          <Link
            href="/register"
            className="border border-white text-white hover:bg-white/10 font-medium px-8 py-3 rounded-full transition"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  );
}
