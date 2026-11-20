import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function UnsupportedScreen({ onBack }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black">
      <div className="flex h-full w-full max-w-[430px] flex-col items-center justify-center bg-[#141414] px-6 text-center">
        <div className="flex w-full max-w-sm flex-col items-center rounded-3xl bg-[#222020] px-6 py-10 shadow-xl">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f5bd58]/20 text-[#f5bd58]">
            <AlertTriangle className="h-11 w-11 stroke-[2]" />
          </div>

          <h1 className="mb-3 text-xl font-bold text-white">Aviso</h1>

          <p className="mb-8 text-base leading-relaxed text-gray-300">
            Essa funcionalidade não está prevista para essa versão do protótipo
            de alta fidelidade.
          </p>

          <button
            type="button"
            onClick={onBack}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#27b5d4] py-3.5 text-base font-bold text-white shadow active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}