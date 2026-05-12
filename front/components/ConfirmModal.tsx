'use client';

interface Props {
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmModal({ mensagem, onConfirmar, onCancelar }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-20"
      onClick={(e) => e.target === e.currentTarget && onCancelar()}
    >
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-sm space-y-5">
        <p className="text-white text-center text-sm">{mensagem}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirmar}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition"
          >
            Excluir
          </button>
          <button
            onClick={onCancelar}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
