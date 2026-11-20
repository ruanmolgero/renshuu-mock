import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import LessonsFlow from './screens/LessonsFlow';
import DictionaryFlow from './screens/DictionaryFlow';
import UnsupportedScreen from './screens/UnsupportedScreen';

export default function App() {
  // Active route: 'home' | 'lessons' | 'dictionary'
  const [currentScreen, setCurrentScreen] = useState('home');

  // Overlay state so underlying screens preserve their internal progress
  const [showUnsupported, setShowUnsupported] = useState(false);

  const [coins, setCoins] = useState(10);
  const [level, setLevel] = useState(2);
  const [progress, setProgress] = useState(70);

  const handleGoHome = () => {
    setShowUnsupported(false);
    setCurrentScreen('home');
  };

  const handleUnsupportedFeature = () => setShowUnsupported(true);

  return (
    <div className="flex min-h-screen w-full justify-center bg-black">
      <main className="relative h-screen w-full max-w-[430px] overflow-y-auto bg-[#141414] shadow-2xl">
        {currentScreen === 'home' && (
          <HomeScreen
            coins={coins}
            level={level}
            progress={progress}
            onNavigate={setCurrentScreen}
            onUnsupportedFeature={handleUnsupportedFeature}
          />
        )}

        {currentScreen === 'lessons' && (
          <LessonsFlow
            onGoHome={handleGoHome}
            onUnsupportedFeature={handleUnsupportedFeature}
          />
        )}

        {currentScreen === 'dictionary' && (
          <DictionaryFlow
            onGoHome={handleGoHome}
            onUnsupportedFeature={handleUnsupportedFeature}
          />
        )}

        {showUnsupported && (
          <UnsupportedScreen onBack={() => setShowUnsupported(false)} />
        )}
      </main>
    </div>
  );
}