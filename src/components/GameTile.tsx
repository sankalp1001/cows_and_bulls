import { cn } from "@/lib/utils";

interface GameTileProps {
  letter: string;
  index: number;
  isActive: boolean;
  isSubmitted: boolean;
}

export const GameTile = ({ letter, index, isActive, isSubmitted }: GameTileProps) => {
  return (
    <div
      className={cn(
        "w-14 h-14 sm:w-16 sm:h-16 border-2 rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase transition-all duration-300",
        letter && !isSubmitted && "border-[hsl(var(--tile-active))] tile-pop",
        !letter && !isActive && "border-[hsl(var(--tile-border))] bg-[hsl(var(--tile-empty))]",
        !letter && isActive && "border-[hsl(var(--tile-active))] bg-[hsl(var(--tile-empty))]",
        letter && !isSubmitted && "bg-[hsl(var(--tile-empty))] text-[hsl(var(--tile-filled))]",
        isSubmitted && "bg-[hsl(var(--muted))] border-[hsl(var(--tile-border))] text-[hsl(var(--muted-foreground))]"
      )}
      style={{
        animationDelay: `${index * 0.1}s`
      }}
    >
      {letter}
    </div>
  );
};
