import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  List,
  MessageSquare,
  X,
  ArrowRight,
} from 'lucide-react';
import TopBar from '../components/TopBar';

const CONTENT_ITEMS = [
  { id: 1, romaji: 'a', kana: 'あ' },
  { id: 2, romaji: 'i', kana: 'い' },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    promptLine1: 'a em',
    promptLine2: 'hiragana',
    correct: 'あ',
    options: ['あ', 'い', 'ま', 'お'],
  },
  {
    id: 2,
    promptLine1: 'i em',
    promptLine2: 'hiragana',
    correct: 'い',
    options: ['る', 'い', 'ま', 'の'],
  },
];

export default function LessonsFlow({ onGoHome, onUnsupportedFeature }) {
  // Internal flow state: 'schedule' | 'content' | 'transition' | 'quiz' | 'result'
  const [step, setStep] = useState('schedule');
  const [contentIndex, setContentIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const speakKana = (kana) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(kana);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartHiragana = () => {
    setContentIndex(0);
    setQuizIndex(0);
    setAnswers({});
    setStep('content');
  };

  const handleNextContent = () => {
    if (contentIndex < CONTENT_ITEMS.length - 1) {
      setContentIndex(contentIndex + 1);
    } else {
      setStep('transition');
    }
  };

  const handlePrevContent = () => {
    if (contentIndex > 0) {
      setContentIndex(contentIndex - 1);
    }
  };

  const handleReviewContent = () => {
    setContentIndex(0);
    setStep('content');
  };

  const handleStartQuiz = () => {
    setQuizIndex(0);
    setAnswers({});
    setStep('quiz');
  };

  const handleSelectOption = (option) => {
    if (answers[quizIndex]) return;
    setAnswers((prev) => ({ ...prev, [quizIndex]: option }));
  };

  const handleNextQuiz = () => {
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setStep('result');
    }
  };

  const handlePrevQuiz = () => {
    if (quizIndex > 0) {
      setQuizIndex(quizIndex - 1);
    }
  };

  // Compute score percentage (0, 50, or 100)
  const correctCount = QUIZ_QUESTIONS.reduce(
    (acc, question, idx) => acc + (answers[idx] === question.correct ? 1 : 0),
    0
  );
  const scorePercentage = Math.round(
    (correctCount / QUIZ_QUESTIONS.length) * 100
  );

  const currentContent = CONTENT_ITEMS[contentIndex];
  const currentQuestion = QUIZ_QUESTIONS[quizIndex];
  const selectedAnswer = answers[quizIndex];
  const isCorrect = selectedAnswer === currentQuestion.correct;

  return (
    <div className="flex min-h-full flex-col bg-[#141414] px-5 pt-4 pb-6">
      <TopBar
        onGoHome={onGoHome}
        onUnsupportedFeature={onUnsupportedFeature}
      />

      {/* Main Dark Rounded Container */}
      <div className="flex flex-1 flex-col rounded-3xl bg-[#222020] px-5 py-6">
        {/* ==================== SCREEN 2: SCHEDULE ==================== */}
        {step === 'schedule' && (
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-normal leading-tight text-white">
              Programação
              <br />
              de Estudos
            </h1>

            {/* Hiragana Card (Active) */}
            <button
              type="button"
              onClick={handleStartHiragana}
              className="flex items-center gap-4 rounded-3xl bg-[#2eaee0] p-4 text-left shadow-md active:scale-[0.98] transition-transform"
            >
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-[#f5f6ee] text-6xl font-bold text-black">
                お
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <span className="text-3xl font-normal text-black">Hiragana</span>
                <div className="flex items-center justify-between rounded-xl bg-[#0b71b8] p-1 pr-3">
                  <span className="rounded-lg bg-[#a8bc38] px-3 py-1.5 text-sm font-bold text-black">
                    Aprender
                  </span>
                  <span className="text-sm font-bold text-black">0/20</span>
                </div>
              </div>
            </button>

            {/* Katakana Card (Triggers Unsupported Warning) */}
            <button
              type="button"
              onClick={onUnsupportedFeature}
              className="flex items-center gap-4 rounded-3xl bg-[#f28b82] p-4 text-left shadow-md active:scale-[0.98] transition-transform"
            >
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-[#f5f6ee] text-6xl font-bold text-black">
                ネ
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <span className="text-3xl font-normal text-black">Katakana</span>
                <div className="flex items-center justify-between rounded-xl bg-[#cc5b54] p-1 pr-3">
                  <span className="rounded-lg bg-[#a8bc38] px-3 py-1.5 text-sm font-bold text-black">
                    Aprender
                  </span>
                  <span className="text-sm font-bold text-black">0/20</span>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* ==================== SCREENS 3 & 4: CONTENT ==================== */}
        {step === 'content' && (
          <div className="flex flex-1 flex-col items-center">
            <h1 className="mb-4 text-3xl font-normal text-white">Conteúdo</h1>

            <div className="mb-5 rounded-full bg-[#4f4f4f] px-5 py-1.5 text-base text-white">
              {contentIndex + 1} de {CONTENT_ITEMS.length}
            </div>

            <div className="flex w-full flex-1 flex-col justify-between bg-[#f6f7f0] p-3 text-black">
              <div className="relative flex items-center justify-center pt-1">
                {contentIndex > 0 && (
                  <button
                    type="button"
                    aria-label="Anterior"
                    onClick={handlePrevContent}
                    className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#9e9e9e] text-white active:scale-95"
                  >
                    <ChevronLeft className="h-7 w-7 stroke-[3]" />
                  </button>
                )}

                <span className="text-3xl font-medium text-black">
                  {currentContent.romaji}
                </span>

                <button
                  type="button"
                  aria-label="Próximo"
                  onClick={handleNextContent}
                  className="absolute right-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#9e9e9e] text-white active:scale-95"
                >
                  <ChevronRight className="h-7 w-7 stroke-[3]" />
                </button>
              </div>

              <div className="flex flex-1 items-center justify-center py-6">
                <span className="text-[150px] leading-none font-bold text-black">
                  {currentContent.kana}
                </span>
              </div>

              {/* Bottom 4 Action Tiles */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => speakKana(currentContent.kana)}
                  className="flex h-24 flex-col items-center justify-between bg-[#f5bd58] px-1 py-2.5 text-black active:brightness-95"
                >
                  <Volume2 className="mt-2 h-8 w-8 stroke-[1.8]" />
                  <span className="text-[10px] font-semibold uppercase">OUÇA</span>
                </button>

                <button
                  type="button"
                  onClick={onUnsupportedFeature}
                  className="flex h-24 flex-col items-center justify-between bg-[#f5bd58] px-1 py-2.5 text-black active:brightness-95"
                >
                  <svg viewBox="0 0 48 24" className="mt-3 h-7 w-10" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 18 C10 14, 18 4, 22 10 C26 16, 18 20, 28 12 C35 6, 40 16, 46 8" strokeLinecap="round" />
                  </svg>
                  <span className="text-[10px] font-semibold uppercase">DESENHE</span>
                </button>

                <button
                  type="button"
                  onClick={onUnsupportedFeature}
                  className="flex h-24 flex-col items-center justify-between bg-[#f5bd58] px-1 py-2 text-center text-black active:brightness-95"
                >
                  <List className="mt-1 h-8 w-8 stroke-[2.2]" />
                  <span className="text-[9px] leading-tight font-semibold uppercase">
                    APRENDA A DESENHAR
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onUnsupportedFeature}
                  className="flex h-24 flex-col items-center justify-between bg-[#f5bd58] px-1 py-2.5 text-black active:brightness-95"
                >
                  <MessageSquare className="mt-2 h-8 w-8 stroke-[1.5]" />
                  <span className="text-[10px] font-semibold uppercase">EXEMPLOS</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SCREEN 5: TRANSITION ==================== */}
        {step === 'transition' && (
          <div className="relative flex flex-1 flex-col items-center justify-between py-2 text-center">
            <div className="flex w-full items-center justify-between">
              <button
                type="button"
                aria-label="Voltar ao conteúdo"
                onClick={() => {
                  setContentIndex(CONTENT_ITEMS.length - 1);
                  setStep('content');
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9e9e9e] text-[#222020] active:scale-95"
              >
                <ChevronLeft className="h-7 w-7 stroke-[3]" />
              </button>

              <button
                type="button"
                aria-label="Sair da lição"
                onClick={() => setStep('schedule')}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#7d7d7d] text-[#7d7d7d] active:scale-95"
              >
                <X className="h-6 w-6 stroke-[2.5]" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-6 px-2">
              <h1 className="text-3xl leading-snug font-normal text-white">
                Você
                <br />
                terminou o
                <br />
                conteúdo
              </h1>

              <div className="text-7xl" role="img" aria-label="Festa">
                🎉
              </div>

              <p className="text-3xl leading-snug font-normal text-white">
                Iniciar o
                <br />
                questionário?
              </p>
            </div>

            <div className="mt-4 grid w-full grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleStartQuiz}
                className="flex h-28 items-center justify-center rounded-3xl bg-[#a8bc38] px-3 text-lg font-bold uppercase text-black shadow active:scale-95 transition-transform"
              >
                VAMOS
                <br />
                NESSA!
              </button>

              <button
                type="button"
                onClick={handleReviewContent}
                className="flex h-28 items-center justify-center rounded-3xl bg-[#cf524a] px-3 text-lg font-bold uppercase text-black shadow active:scale-95 transition-transform"
              >
                REVER
                <br />
                CONTEÚDO
              </button>
            </div>
          </div>
        )}

        {/* ==================== SCREENS 6 - 15: QUIZ ==================== */}
        {step === 'quiz' && (
          <div className="flex flex-1 flex-col items-center">
            <h1 className="mb-8 text-3xl font-normal text-white">Questionário</h1>

            <div className="relative mb-6 flex w-full flex-1 flex-col items-center bg-[#f6f7f0] px-5 pt-10 pb-12 text-black">
              <div className="absolute -top-5 flex w-full items-center justify-center px-1">
                {quizIndex > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevQuiz}
                    className="absolute -left-2 rounded-full bg-[#9e9e9e] px-5 py-2 text-base font-medium text-white shadow active:scale-95"
                  >
                    voltar
                  </button>
                )}

                <div className="rounded-full bg-[#4f4f4f] px-5 py-2 text-sm font-medium text-white shadow">
                  Questão {quizIndex + 1} de {QUIZ_QUESTIONS.length}
                </div>

                {quizIndex < QUIZ_QUESTIONS.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextQuiz}
                    className="absolute -right-2 rounded-full bg-[#9e9e9e] px-5 py-2 text-base font-medium text-white shadow active:scale-95"
                  >
                    pular
                  </button>
                )}
              </div>

              <div className="mb-8 text-center text-3xl leading-snug font-normal text-black">
                <div>{currentQuestion.promptLine1}</div>
                <div>{currentQuestion.promptLine2}</div>
              </div>

              <div className="grid w-full max-w-[260px] grid-cols-2 gap-6">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  let bgColor = 'bg-[#f5bd58]';

                  if (isSelected) {
                    bgColor =
                      option === currentQuestion.correct
                        ? 'bg-[#a8bc38]'
                        : 'bg-[#cc4d47]';
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelectOption(option)}
                      className={`flex aspect-square items-center justify-center text-7xl font-bold text-black shadow-sm transition-all active:scale-95 ${bgColor}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer && (
                <button
                  type="button"
                  onClick={handleNextQuiz}
                  className={`absolute -bottom-8 flex h-20 w-36 flex-col items-center justify-center rounded-2xl text-sm font-semibold text-black shadow-lg active:scale-95 transition-transform ${
                    isCorrect ? 'bg-[#a8bc38]' : 'bg-[#cc4d47]'
                  }`}
                >
                  <span>{isCorrect ? 'ACERTOU!' : 'ERROU :('}</span>
                  <ArrowRight className="mt-1 h-5 w-5 stroke-[2]" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ==================== SCREEN 16: LESSON RESULT ==================== */}
        {step === 'result' && (
          <div className="relative flex flex-1 flex-col items-center justify-between pt-2 text-center">
            {/* Close Button (Top Right) */}
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setStep('schedule')}
              className="absolute -top-2 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#7d7d7d] text-[#7d7d7d] active:scale-95"
            >
              <X className="h-6 w-6 stroke-[2.5]" />
            </button>

            {/* Header */}
            <h1 className="mt-2 px-4 text-3xl leading-snug font-normal text-white">
              Parabéns! Você
              <br />
              terminou a lição
            </h1>

            {/* Divider with Party Popper */}
            <div className="relative my-3 flex w-full items-center justify-center">
              <div className="h-2.5 w-44 rounded-full bg-[#e6e6e6]" />
              <span
                className="absolute right-1 text-5xl"
                role="img"
                aria-label="Festa"
              >
                🎉
              </span>
            </div>

            {/* Score Section */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Questionário</h2>

              {/* Score Ring */}
              <div className="flex h-44 w-44 items-center justify-center rounded-full bg-[#f4c7c3] p-5 shadow-md">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#cc4d47] text-3xl font-medium text-black">
                  {scorePercentage} %
                </div>
              </div>
            </div>

            {/* Secondary Action Buttons (Unsupported Warning) */}
            <div className="my-5 flex w-full flex-col items-center gap-2.5">
              <div className="flex w-full max-w-[260px] gap-2.5">
                <button
                  type="button"
                  onClick={onUnsupportedFeature}
                  className="flex-1 rounded-3xl bg-[#2eaee0] py-3.5 text-lg font-bold text-black shadow active:scale-95 transition-transform"
                >
                  Revisão
                </button>
                <button
                  type="button"
                  onClick={onUnsupportedFeature}
                  className="flex-1 rounded-3xl bg-[#0b71b8] py-3.5 text-lg font-bold text-black shadow active:scale-95 transition-transform"
                >
                  Erros
                </button>
              </div>

              <button
                type="button"
                onClick={onUnsupportedFeature}
                className="w-full max-w-[260px] rounded-3xl bg-[#2eaee0] py-3 text-lg font-bold text-black shadow active:scale-95 transition-transform"
              >
                Refazer Questionário
              </button>
            </div>

            {/* Bottom Divider */}
            <div className="mb-4 h-2.5 w-44 rounded-full bg-[#e6e6e6]" />

            {/* Bottom Navigation Buttons */}
            <div className="grid w-full grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setStep('schedule')}
                className="rounded-3xl bg-[#f5bd58] py-4 text-lg font-bold text-black shadow active:scale-95 transition-transform"
              >
                Mais lições
              </button>

              <button
                type="button"
                onClick={onGoHome}
                className="rounded-3xl bg-[#f5bd58] py-4 text-lg font-bold text-black shadow active:scale-95 transition-transform"
              >
                Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}