import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  greyedLetters: Set<string>;
  onToggleGrey: (letter: string) => void;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

export const Keyboard = ({ onKeyPress, onEnter, onBackspace, greyedLetters, onToggleGrey }: KeyboardProps) => {
  const handleClick = (key: string) => {
    if (key === "ENTER") {
      onEnter();
    } else if (key === "⌫") {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  };

  const handleRightClick = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    if (key !== "ENTER" && key !== "⌫") {
      onToggleGrey(key);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-4">
      <div className="flex flex-col gap-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => (
              <Button
                key={key}
                onClick={() => handleClick(key)}
                onContextMenu={(e) => handleRightClick(e, key)}
                className={cn(
                  "h-14 font-semibold text-sm transition-all duration-200",
                  key === "ENTER" || key === "⌫" ? "px-4 min-w-[60px]" : "w-10 px-0",
                  greyedLetters.has(key)
                    ? "bg-[hsl(var(--key-greyed))] text-[hsl(var(--key-text))] opacity-50"
                    : "bg-[hsl(var(--key-bg))] text-[hsl(var(--key-text))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                )}
                variant="ghost"
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
      </div>
      <p className="text-xs text-center mt-3 text-[hsl(var(--muted-foreground))]">
        Right-click letters to grey them out
      </p>
    </div>
  );
};
