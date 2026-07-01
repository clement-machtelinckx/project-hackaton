import type { KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatInputProps = {
    value: string;
    loading: boolean;
    onChange: (value: string) => void;
    onSubmit: () => void;
};

export function ChatInput({ value, loading, onChange, onSubmit }: ChatInputProps) {
    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
        }
    }

    return (
        <div className="border-t p-4 md:p-6">
            <div className="flex items-end gap-2">
                <Textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question…"
                    maxLength={2_000}
                    rows={2}
                    disabled={loading}
                    aria-label="Votre question"
                    className="max-h-40 min-h-20 resize-none"
                />
                <Button
                    type="button"
                    size="icon-lg"
                    onClick={onSubmit}
                    disabled={loading || value.trim().length === 0}
                    aria-label="Envoyer la question"
                >
                    <Send aria-hidden="true" />
                </Button>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
                Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne
            </p>
        </div>
    );
}
