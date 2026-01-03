"use client";

type Props = {
  name: string;
  description: string;
  onClick?: () => void;
};

export default function CategoryCard({ name, description, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
        w-full bg-white border border-gray-200 rounded-xl p-5
        h-[140px]
        flex flex-col justify-start gap-3 text-left
        cursor-pointer transition
        hover:border-violet-300 hover:shadow-md hover:scale-[1.02]
        focus:outline-none focus:ring-2 focus:ring-violet-600
      "
    >
      <h2 className="text-base font-semibold text-gray-900 line-clamp-2">
        {name}
      </h2>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
        {description}
      </p>
    </button>
  );
}
