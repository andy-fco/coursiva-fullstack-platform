"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

type Props = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: Props) {
  const router = useRouter();
  const { token, isAdmin, loading } = useAuthContext();

  useEffect(() => {
    if (loading) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    if (requireAdmin && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [token, isAdmin, requireAdmin, loading, router]);

  if (loading) return null;
  if (!token) return null;
  if (requireAdmin && !isAdmin) return null;

  return <>{children}</>;
}
