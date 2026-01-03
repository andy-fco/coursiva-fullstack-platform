"use client";

import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 space-y-5 shadow-xl">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold italic text-gray-900 border-b border-violet-200 pb-1">
            {title}
          </h2>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
