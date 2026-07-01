"use client";

import type { ComponentProps } from "react";
import { useChatWidget } from "./chat-widget-context";
import { Button } from "@/components/ui/button";

type AskAssistantButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
    question?: string;
};

export function AskAssistantButton({ question, children, ...props }: AskAssistantButtonProps) {
    const { askAssistant, setOpen } = useChatWidget();

    return (
        <Button
            type="button"
            onClick={() => (question ? askAssistant(question) : setOpen(true))}
            {...props}
        >
            {children}
        </Button>
    );
}
