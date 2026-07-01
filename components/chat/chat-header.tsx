import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatHeaderProps = {
    hasMessages: boolean;
    onReset: () => void;
};

export function ChatHeader({ hasMessages, onReset }: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4 border-b px-4 py-4 md:px-6">
            <div>
                <h2 className="font-semibold">Assistant pédagogique</h2>
                <p className="text-muted-foreground text-sm">
                    Réponses fondées sur les sources locales
                </p>
            </div>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onReset}
                disabled={!hasMessages}
            >
                <RotateCcw aria-hidden="true" />
                Réinitialiser
            </Button>
        </div>
    );
}
