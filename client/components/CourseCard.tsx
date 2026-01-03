"use client";

import Link from "next/link";

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

type Props = {
  course: Course;
  footer?: React.ReactNode;
};

export default function CourseCard({ course, footer }: Props) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="
        block bg-white border border-gray-200 rounded-xl p-5
        h-[200px]
        flex flex-col justify-between
        cursor-pointer transition
        hover:shadow-md hover:scale-[1.02]
      "
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {course.title}
          </h2>

          <span
            className="
              max-w-[120px]
              text-xs font-medium text-violet-700 bg-violet-100
              px-2 py-0.5 rounded-full
              text-center leading-tight break-words
            "
          >
            {course.category.name}
          </span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {course.description}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="italic">{course.durationHours} hs</span>
      </div>

      {footer && <div className="pt-2">{footer}</div>}
    </Link>
  );
}
