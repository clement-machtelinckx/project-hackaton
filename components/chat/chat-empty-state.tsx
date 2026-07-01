import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
    "Quels sont les objectifs du cursus CDA ?",
    "Comment valider un bloc de compétences ?",
    "Quelles sont les modalités d’évaluation ?",
    "Que se passe-t-il en cas d’absence ?",
] as const;

export function ChatEmptyState({ onSelect }: { onSelect: (question: string) => void }) {
    return (
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-10 text-center">
            <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <GraduationCap aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Campus Copilot</h2>
            <p className="text-muted-foreground mt-2 leading-6">
                Posez une question sur votre formation, les compétences attendues, les évaluations
                ou les modalités de validation.
            </p>
            <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((suggestion) => (
                    <Button
                        key={suggestion}
                        type="button"
                        variant="outline"
                        className="h-auto justify-start py-3 text-left whitespace-normal"
                        onClick={() => onSelect(suggestion)}
                    >
                        {suggestion}
                    </Button>
                ))}
            </div>
        </div>
    );
}
