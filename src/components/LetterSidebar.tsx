import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LetterSidebarProps {
  greyedLetters: Set<string>;
  onToggleLetter: (letter: string) => void;
  onClearAll: () => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const LetterSidebar = ({ greyedLetters, onToggleLetter, onClearAll }: LetterSidebarProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-background/50 rounded-lg border border-border min-w-[160px]">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-foreground">Letters</h3>
        <Button
          onClick={onClearAll}
          variant="ghost"
          size="sm"
          className="h-6 text-xs hover:bg-primary/10"
        >
          Clear
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {ALPHABET.map((letter) => (
          <Button
            key={letter}
            onClick={() => onToggleLetter(letter)}
            className={cn(
              "h-10 w-10 p-0 font-semibold text-sm transition-all duration-200",
              greyedLetters.has(letter)
                ? "bg-muted/50 text-muted-foreground line-through opacity-40 hover:opacity-60"
                : "bg-primary/10 text-foreground hover:bg-primary/20 hover:scale-105"
            )}
            variant="ghost"
          >
            {letter}
          </Button>
        ))}
      </div>
      
      <p className="text-xs text-center text-muted-foreground">
        Click to cross out letters
      </p>
    </div>
  );
};
