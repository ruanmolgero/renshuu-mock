import React, { useState, useRef } from 'react';
import {
  Search,
  Delete,
  ArrowUp,
  Keyboard,
  Pencil,
  Eraser,
} from 'lucide-react';
import TopBar from '../components/TopBar';

/**
 * Simple inline SVG recreation of the dog illustration from the result card.
 * Tip: If you prefer the exact PNG, save it in /public/dog.png and swap this for an <img>.
 */
function DogIllustration() {
  return (
    <svg viewBox="0 0 140 140" className="h-full w-full">
      {/* Body */}
      <path
        d="M52 72 C46 92, 46 112, 54 120 L92 120 C106 120, 114 106, 108 92 C102 80, 92 74, 82 70 Z"
        fill="#f0c888"
        stroke="#221e17"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Tail */}
      <path
        d="M106 104 C118 100, 122 88, 118 82 C114 86, 110 92, 105 94"
        fill="#f0c888"
        stroke="#221e17"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Back leg */}
      <path
        d="M84 96 C94 98, 100 108, 98 118 C92 122, 82 122, 78 118"
        fill="#f0c888"
        stroke="#221e17"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Front leg */}
      <path
        d="M58 92 L56 120 C62 123, 70 122, 72 118 L72 98"
        fill="#f0c888"
        stroke="#221e17"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Head */}
      <path
        d="M32 46 C32 28, 48 20, 66 22 C84 24, 94 36, 92 52 C90 66, 78 76, 60 76 C44 76, 36 66, 32 54 C26 52, 26 44, 32 46 Z"
        fill="#f0c888"
        stroke="#221e17"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Floppy ear */}
      <path
        d="M72 34 C86 34, 98 48, 96 66 C94 74, 82 76, 76 68 C70 60, 68 46, 72 34 Z"
        fill="#e5b873"
        stroke="#221e17"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Nose */}
      <ellipse cx="30" cy="45" rx="4.5" ry="3.5" fill="#221e17" />
      {/* Eye */}
      <circle cx="48" cy="42" r="3.5" fill="#221e17" />
      <circle cx="47" cy="40.8" r="1.1" fill="#ffffff" />
      {/* Smile */}
      <path
        d="M32 56 Q38 60 44 56"
        fill="none"
        stroke="#221e17"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Accepted search terms that resolve to the "cachorro / 犬" entry
const VALID_DOG_QUERIES = ['犬', 'inu', 'inú', 'いぬ', 'cachorro', 'cão', 'cao'];

// Extra mock entries displayed when "Mostrar resultados avançados" is checked
const ADVANCED_RESULTS = [
  {
    word: '子犬',
    reading: 'こいぬ (koinu)',
    meaning: 'Filhote de cachorro',
    tag: 'JLPT N3',
  },
  {
    word: '番犬',
    reading: 'ばんけん (banken)',
    meaning: 'Cão de guarda',
    tag: 'Comum',
  },
  {
    word: '盲導犬',
    reading: 'もうどうけん (moudouken)',
    meaning: 'Cão-guia',
    tag: 'JLPT N2',
  },
];

export default function DictionaryFlow({ onGoHome, onUnsupportedFeature }) {
  // Input mode: 'draw' | 'type'
  const [inputMode, setInputMode] = useState('draw');

  // View state: 'idle' (screen 17) | 'active' (typing or drawing 18-21) | 'results' (screen 22)
  const [view, setView] = useState('idle');

  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Canvas drawing state
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleModeChange = (mode) => {
  if (mode === inputMode) return;

  setInputMode(mode);
  setQuery('');
  setSubmittedQuery('');
  setView('active');
  setHasDrawn(false);
};

  const handleSearchBarClick = () => {
    if (view !== 'active') {
      setView('active');
    }
  };

  const handleClearQuery = () => {
    setQuery('');
    if (view === 'results') {
      setView('active');
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const cleaned = query.trim();
    if (!cleaned) return;
    setSubmittedQuery(cleaned);
    setView('results');
  };

  // ==================== CANVAS DRAWING HANDLERS ====================
  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasPoint(e);

    ctx.strokeStyle = '#141414';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current = true;
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasPoint(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    setHasDrawn(true);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSelectCandidate = (kanji) => {
    setQuery(kanji);
  };

  const isDogResult = VALID_DOG_QUERIES.includes(submittedQuery.toLowerCase());

  return (
    <div className="flex min-h-full flex-col bg-[#141414] px-5 pt-4 pb-8">
      <TopBar
        onGoHome={onGoHome}
        onUnsupportedFeature={onUnsupportedFeature}
        helpText="Escolha entre Digitar ou Desenhar um kanji para pesquisar palavras. Marque 'Mostrar resultados avançados' para ver detalhes extras."
      />

      {/* Screen Title */}
      <h1 className="mb-4 text-2xl font-normal leading-snug text-white">
        Dicionário Português -
        <br />
        Japonês
      </h1>

      {/* Mode Switcher: Type vs Draw */}
      <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl bg-[#242424] p-1">
        <button
          type="button"
          onClick={() => handleModeChange('type')}
          className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${
            inputMode === 'type'
              ? 'bg-[#27b5d4] text-white shadow'
              : 'text-gray-300'
          }`}
        >
          <Keyboard className="h-4 w-4" />
          Digitar
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('draw')}
          className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${
            inputMode === 'draw'
              ? 'bg-[#27b5d4] text-white shadow'
              : 'text-gray-300'
          }`}
        >
          <Pencil className="h-4 w-4" />
          Desenhar
        </button>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        onClick={handleSearchBarClick}
        className="flex h-12 w-full items-center rounded-lg bg-[#525252] px-3 shadow-inner"
      >
        {inputMode === 'type' ? (
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (view !== 'active') setView('active');
            }}
            placeholder="Digite: cachorro, inu ou 犬"
            className="w-full bg-transparent text-base text-white placeholder-gray-300 focus:outline-none"
          />
        ) : (
          <div className="flex flex-1 items-center">
            {query ? (
              <span className="text-xl text-white">
                {query}
                {view === 'active' && (
                  <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-white align-middle" />
                )}
              </span>
            ) : view === 'active' ? (
              <span className="inline-block h-5 w-0.5 animate-pulse bg-white" />
            ) : (
              /* Centered scribble icon for idle state (screen 17) */
              <div className="flex flex-1 justify-center pl-6">
                <svg
                  viewBox="0 0 64 20"
                  className="h-5 w-16 text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M4 16 C14 12, 24 2, 28 8 C32 14, 24 18, 36 10 C44 4, 48 16, 60 6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
          </div>
        )}

        {/* Backspace / Clear Icon (visible when active or has query) */}
        {(view === 'active' || query) && (
          <button
            type="button"
            aria-label="Apagar"
            onClick={(e) => {
              e.stopPropagation();
              handleClearQuery();
            }}
            className="mr-2 text-gray-300 active:scale-90"
          >
            <Delete className="h-6 w-6 stroke-[1.8]" />
          </button>
        )}

        {/* Magnifying Glass Submit Button */}
        <button
          type="submit"
          aria-label="Pesquisar"
          onClick={(e) => e.stopPropagation()}
          className="text-gray-200 active:scale-90"
        >
          <Search className="h-6 w-6 stroke-[2.2]" />
        </button>
      </form>

      {/* Advanced Results Checkbox */}
      <label className="mt-3 mb-5 flex cursor-pointer items-center gap-2.5 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={showAdvanced}
          onChange={(e) => setShowAdvanced(e.target.checked)}
          className="h-4 w-4 rounded border-gray-500 accent-[#27b5d4]"
        />
        <span>Mostrar resultados avançados</span>
      </label>

      {/* ==================== SCREEN 17: IDLE PROMPT ==================== */}
      {view === 'idle' && (
        <div className="mt-10 flex flex-col items-center text-center text-white">
          <ArrowUp className="mb-4 h-16 w-16 stroke-[2.5]" />
          <p className="max-w-[240px] text-lg leading-snug">
            {inputMode === 'draw'
              ? 'Toque na barra acima para desenhar um kanji ou hiragana'
              : 'Toque na barra acima para digitar uma palavra'}
          </p>
        </div>
      )}

      {/* ==================== SCREENS 18-21: DRAWING PAD ==================== */}
      {view === 'active' && inputMode === 'draw' && (
        <div className="flex flex-col">
          {/* Drawing Box with Dashed Crosshair */}
          <div className="relative aspect-square w-full overflow-hidden bg-[#f6f7f0] shadow-md">
            {/* Dashed Crosshair Guide (non-interactive) */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[88%] border-l-4 border-dashed border-[#141414]" />
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-[94%] border-t-4 border-dashed border-[#141414]" />
            </div>

            {/* Clear Canvas Button */}
            {hasDrawn && (
              <button
                type="button"
                onClick={handleClearCanvas}
                className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1 rounded-lg bg-[#222020]/80 px-2.5 py-1.5 text-xs font-semibold text-white active:scale-95"
              >
                <Eraser className="h-3.5 w-3.5" />
                Limpar
              </button>
            )}

            {/* Interactive HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative z-0 h-full w-full touch-none cursor-crosshair"
            />
          </div>

          {/* Autocomplete Kanji Candidates (appears after drawing - screens 19-21) */}
          {hasDrawn ? (
            <div className="mt-4 flex items-center gap-3">
              {['犬', '大'].map((candidate) => (
                <button
                  key={candidate}
                  type="button"
                  onClick={() => handleSelectCandidate(candidate)}
                  className={`flex h-14 w-14 items-center justify-center rounded-xl text-3xl font-medium text-black shadow transition-transform active:scale-95 ${
                    query === candidate
                      ? 'bg-[#a8bc38] ring-2 ring-white'
                      : 'bg-[#9e9e9e]'
                  }`}
                >
                  {candidate}
                </button>
              ))}
              <span className="ml-1 text-xs text-gray-400">
                Toque no kanji desejado e depois na lupa
              </span>
            </div>
          ) : (
            <p className="mt-3 text-center text-xs text-gray-400">
              Desenhe o kanji no quadro acima (ex: 犬)
            </p>
          )}
        </div>
      )}

      {/* ==================== TYPING MODE HELPER ==================== */}
      {view === 'active' && inputMode === 'type' && (
        <div className="mt-4 rounded-2xl bg-[#222020] p-4 text-sm text-gray-300">
          <p className="mb-2 font-semibold text-white">Sugestão para o teste:</p>
          <p className="text-xs leading-relaxed text-gray-400">
            Digite <strong>cachorro</strong>, <strong>inu</strong>,{' '}
            <strong>いぬ</strong> ou <strong>犬</strong> na barra acima e toque
            na lupa para ver o resultado.
          </p>
        </div>
      )}

      {/* ==================== SCREEN 22: SEARCH RESULTS ==================== */}
      {view === 'results' && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white">Resultados</h2>

          {isDogResult ? (
            <>
              {/* Beginner-Friendly Result Card (screen 22) */}
              <div className="flex items-stretch gap-3 rounded-3xl bg-[#a8bc38] p-3.5 shadow-lg">
                {/* Dog Image Box */}
                <div className="flex w-[46%] items-center justify-center rounded-2xl bg-[#7b8936] p-2">
                  <DogIllustration />
                </div>

                {/* Word Details Box */}
                <div className="flex flex-1 flex-col justify-center rounded-2xl bg-[#7b8936] px-3.5 py-4 text-black">
                  <h3 className="mb-4 text-base font-extrabold tracking-wide uppercase">
                    CACHORRO
                  </h3>
                  <div className="flex flex-col gap-2 text-sm font-medium">
                    <p>
                      <span className="underline">KANJI</span>: 犬
                    </p>
                    <p>
                      <span className="underline">HIRAGANA</span>: いぬ
                    </p>
                    <p>
                      <span className="underline">PRONÚNCIA</span>: INÚ
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Results Section (visible only when checkbox is checked) */}
              {showAdvanced && (
                <div className="flex flex-col gap-3">
                  {/* Technical Kanji Breakdown */}
                  <div className="rounded-2xl bg-[#222020] p-4 text-sm text-gray-200 shadow">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold text-[#27b5d4]">
                        Detalhes do Kanji (犬)
                      </span>
                      <span className="rounded-full bg-[#3a3a3a] px-2.5 py-0.5 text-xs font-semibold">
                        JLPT N4 · 4 traços
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                      <p>
                        <strong>On&apos;yomi:</strong> ケン (ken)
                      </p>
                      <p>
                        <strong>Kun&apos;yomi:</strong> いぬ (inu)
                      </p>
                      <p>
                        <strong>Radical:</strong> 犬 (cão)
                      </p>
                      <p>
                        <strong>Classe:</strong> Substantivo
                      </p>
                    </div>
                  </div>

                  {/* Compound Words */}
                  <div className="rounded-2xl bg-[#222020] p-4 shadow">
                    <h3 className="mb-3 text-sm font-bold text-[#27b5d4]">
                      Palavras relacionadas e compostos
                    </h3>
                    <div className="flex flex-col divide-y divide-[#333333]">
                      {ADVANCED_RESULTS.map((item) => (
                        <div
                          key={item.word}
                          className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                        >
                          <div>
                            <div className="text-base font-bold text-white">
                              {item.word}{' '}
                              <span className="text-xs font-normal text-gray-400">
                                {item.reading}
                              </span>
                            </div>
                            <div className="text-xs text-gray-300">
                              {item.meaning}
                            </div>
                          </div>
                          <span className="rounded-md bg-[#333333] px-2 py-1 text-[10px] font-semibold text-gray-300">
                            {item.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Feedback if user searches 大 or another word not in the mock */
            <div className="rounded-2xl bg-[#222020] p-5 text-center">
              <p className="mb-2 text-base font-bold text-[#f5bd58]">
                Nenhum resultado encontrado para &ldquo;{submittedQuery}&rdquo;
              </p>
              <p className="mb-4 text-xs leading-relaxed text-gray-400">
                Neste protótipo de alta fidelidade, apenas a busca por{' '}
                <strong className="text-white">犬 (cachorro / inu)</strong> está
                cadastrada.
              </p>
              <button
                type="button"
                onClick={() => setView('active')}
                className="rounded-xl bg-[#27b5d4] px-4 py-2 text-sm font-bold text-white active:scale-95"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}