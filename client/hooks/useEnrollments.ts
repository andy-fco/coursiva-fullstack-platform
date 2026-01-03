"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";

type Category = {
  id: number;
  name: string;
};

type Course = {
  id: number;
  title: string;
  description: string;
  durationHours: number;
  category: Category;
};

export type Enrollment = {
  id: number;
  courseId: number;
  completed: boolean;
  course: Course;
};

export function useEnrollments() {
  const { token } = useAuthContext();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/enrollments/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setEnrollments(data);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const enroll = async (courseId: number) => {
    const res = await fetch("http://localhost:4000/enrollments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error al inscribirse");
    }

    await fetchEnrollments();
  };

  const complete = async (enrollmentId: number) => {
    const res = await fetch(
      `http://localhost:4000/enrollments/${enrollmentId}/complete`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error al completar");
    }

    await fetchEnrollments();
  };

  const cancel = async (enrollmentId: number) => {
    const res = await fetch(
      `http://localhost:4000/enrollments/${enrollmentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error al cancelar");
    }

    await fetchEnrollments();
  };

  const getEnrollmentByCourse = (courseId: number) =>
    enrollments.find((e) => e.courseId === courseId);

  return {
    enrollments,
    loading,
    enroll,
    complete,
    cancel,
    getEnrollmentByCourse,
  };
}
