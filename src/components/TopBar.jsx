import React, { useState } from 'react';
import { Menu, Home, HelpCircle, X } from 'lucide-react';

export default function TopBar({ onGoHome, onUnsupportedFeature, helpText }) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <header className="mb-4 flex items-center justify-between">
        {/* Menu Button -> Unsupported warning */}
        <button
          type="button"
          aria-label="Menu"
          onClick={onUnsupportedFeature}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3a3a3a] text-white active:opacity-80"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Right Actions: Home & Help */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Voltar para Home"
            onClick={onGoHome}
            className="flex h-9 w-9 items-center justify-center text-white active:scale-95 transition-transform"
          >
            <Home className="h-8 w-8 fill-white stroke-white" />
          </button>

          <button
            type="button"
            aria-label="Ajuda"
            onClick={() => setShowHelp(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#27b5d4] text-white active:scale-95 transition-transform"
          >
            <HelpCircle className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-xs rounded-2xl bg-[#222222] p-5 text-white shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#27b5d4]">Ajuda</h2>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="rounded-full p-1 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              {helpText ||
                'Siga os passos da lição para aprender novos caracteres e teste seu conhecimento no questionário.'}
            </p>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-4 w-full rounded-xl bg-[#27b5d4] py-2.5 text-sm font-bold text-white active:opacity-90"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}