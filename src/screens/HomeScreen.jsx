import React, { useState } from 'react';
import {
  Menu,
  HelpCircle,
  ClipboardList,
  BookOpen,
  Sprout,
  Users,
  Settings,
  X,
} from 'lucide-react';

function MascotScene() {
  return (
    <svg
      viewBox="0 0 360 280"
      className="absolute inset-0 h-full w-full object-cover"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="360" height="280" fill="#d4e9ec" />
      <g fill="#eef6f7" opacity="0.85">
        <circle cx="55" cy="95" r="42" />
        <circle cx="115" cy="80" r="52" />
        <circle cx="185" cy="70" r="46" />
        <circle cx="255" cy="85" r="50" />
        <circle cx="325" cy="95" r="45" />
      </g>
      <path d="M0 190 Q90 155 180 185 T360 175 L360 280 L0 280 Z" fill="#9bc24a" />
      <path d="M0 215 Q120 185 230 220 T360 210 L360 280 L0 280 Z" fill="#82ab3b" />
      <path d="M0 245 Q170 225 360 255 L360 280 L0 280 Z" fill="#709931" />
      <g transform="translate(30, 100)">
        <path
          d="M15 48 C15 16, 40 2, 68 2 C96 2, 118 18, 118 48 C118 72, 102 82, 68 82 C34 82, 15 72, 15 48 Z"
          fill="#35b0eb"
          stroke="#136ba8"
          strokeWidth="3.5"
        />
        <ellipse cx="48" cy="22" rx="18" ry="8" fill="#8be0ff" opacity="0.7" transform="rotate(-18 48 22)" />
        <circle cx="48" cy="45" r="3" fill="#0d2b45" />
        <circle cx="88" cy="45" r="3" fill="#0d2b45" />
        <path
          d="M62 49 Q65 55 68 50 Q71 55 74 49"
          fill="none"
          stroke="#0d2b45"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M18 4 L22 14 L32 18 L22 22 L18 32 L14 22 L4 18 L14 14 Z" fill="#ffe135" stroke="#136ba8" strokeWidth="1.5" />
        <path d="M108 58 L112 68 L122 72 L112 76 L108 86 L104 76 L94 72 L104 68 Z" fill="#ffe135" stroke="#136ba8" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export default function HomeScreen({
  coins,
  level,
  progress,
  onNavigate,
  onUnsupportedFeature,
}) {
  const [showHelpModal, setShowHelpModal] = useState(false);

  const menuItems = [
    { id: 'lessons', label: 'Lições', icon: ClipboardList, active: true },
    { id: 'dictionary', label: 'Dicionário', icon: BookOpen, active: true },
    { id: 'garden', label: 'Jardim', icon: Sprout, active: false },
    { id: 'community', label: 'Comunidade', icon: Users, active: false },
    { id: 'settings', label: 'Configurações', icon: Settings, active: false },
  ];

  const handleMenuClick = (item) => {
    if (item.active) {
      onNavigate(item.id);
    } else {
      onUnsupportedFeature();
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-[#141414] px-5 pt-4 pb-8">
      {/* Top Bar */}
      <header className="mb-5 flex items-center justify-between">
        <button
          type="button"
          aria-label="Menu"
          onClick={onUnsupportedFeature}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3a3a3a] text-white active:opacity-80"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-4">
          {/* Coin Counter */}
          <div className="flex items-center gap-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#d49b1a] bg-[#f7cb38] font-bold text-[#a6730a] shadow-inner">
              $
            </div>
            <span className="text-lg font-semibold text-white">{coins}</span>
          </div>

          {/* Help Button */}
          <button
            type="button"
            aria-label="Ajuda"
            onClick={() => setShowHelpModal(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#27b5d4] text-white active:scale-95 transition-transform"
          >
            <HelpCircle className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Hero Mascot & Progress Card */}
      <section className="relative mb-7 h-72 w-full overflow-hidden rounded-2xl shadow-lg">
        <MascotScene />

        <div className="absolute right-4 top-1/2 flex w-[50%] -translate-y-1/2 flex-col gap-2">
          <div className="rounded-xl border-2 border-white/70 bg-[#2aa3e0]/95 py-1.5 text-center text-sm font-semibold tracking-wide text-white shadow">
            LV {level}
          </div>

          <div className="relative flex h-8 items-center overflow-hidden rounded-full border-2 border-white/80 bg-[#6e6e78]/90 shadow">
            <div
              className="h-full bg-gradient-to-b from-[#4fd3eb] to-[#1aa2c7] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#2b3036]">
              {progress}%
            </span>
          </div>
        </div>
      </section>

      {/* Main Navigation Grid */}
      <nav className="grid grid-cols-3 gap-x-4 gap-y-5">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleMenuClick(item)}
              className="group flex flex-col items-center gap-2 focus:outline-none"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#27b5d4] text-white shadow-md transition-transform group-active:scale-95">
                <IconComponent className="h-11 w-11 stroke-[1.6]" />
              </div>
              <span className="text-xs font-bold tracking-wide text-white">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-xs rounded-2xl bg-[#222222] p-5 text-white shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#27b5d4]">Ajuda</h2>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="rounded-full p-1 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              Use <strong>Lições</strong> para praticar japonês e ganhar experiência, ou acesse o{' '}
              <strong>Dicionário</strong> para consultar palavras.
            </p>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="mt-4 w-full rounded-xl bg-[#27b5d4] py-2.5 text-sm font-bold text-white active:opacity-90"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}