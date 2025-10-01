import React from "react";

interface MobileKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  greyedLetters: Set<string>;
  onToggleLetter: (letter: string) => void;
}

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"]
];

export const MobileKeyboard: React.FC<MobileKeyboardProps> = ({ onKeyPress, onBackspace, onEnter, greyedLetters, onToggleLetter }) => {
  // Helper for long press
  const longPressTimeout = React.useRef<NodeJS.Timeout | null>(null);

  function handleTouchStart(key: string) {
    longPressTimeout.current = setTimeout(() => {
      onToggleLetter(key);
    }, 500); // 500ms for long press
  }

  function handleTouchEnd() {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  }

  return (
    <div className="fixed bottom-0 left-0 w-full p-2 z-50 flex flex-col gap-2 shadow-lg" style={{ background: '#18181b', boxShadow: '0 -2px 12px rgba(0,0,0,0.25)' }}>
      {KEYS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-1 overflow-x-auto px-1">
          {row.map((key) => {
            const isGreyed = greyedLetters.has(key);
            return (
              <button
                key={key}
                className={`font-bold rounded-md px-2 py-2 text-lg min-w-[32px] ${isGreyed ? 'bg-zinc-900 text-zinc-500 line-through opacity-50' : 'bg-zinc-700 text-white active:bg-zinc-600'}`}
                style={{ minWidth: 32 }}
                onClick={() => onKeyPress(key)}
                onTouchStart={() => handleTouchStart(key)}
                onTouchEnd={handleTouchEnd}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
      <div className="flex justify-center gap-2 mt-1">
        <button
          className="bg-zinc-600 text-white font-bold rounded-md px-4 py-2 text-lg active:bg-zinc-700"
          onClick={onBackspace}
        >
          ⌫
        </button>
        <button
          className="bg-green-600 text-white font-bold rounded-md px-4 py-2 text-lg active:bg-green-700"
          onClick={onEnter}
        >
          Enter
        </button>
      </div>
      <div className="text-xs text-center text-zinc-400 mt-1">Long press a key to cross it out</div>
    </div>
  );
};
