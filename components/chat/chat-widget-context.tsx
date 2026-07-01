"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useChat } from "@/lib/hooks/use-chat";

type ChatWidgetContextValue = {
    open: boolean;
    setOpen: (open: boolean) => void;
    chat: ReturnType<typeof useChat>;
    askAssistant: (question: string) => void;
};

const ChatWidgetContext = createContext<ChatWidgetContextValue | null>(null);

export function ChatWidgetProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const chat = useChat();

    function askAssistant(question: string) {
        setOpen(true);
        chat.sendMessage(question);
    }

    return (
        <ChatWidgetContext.Provider value={{ open, setOpen, chat, askAssistant }}>
            {children}
        </ChatWidgetContext.Provider>
    );
}

export function useChatWidget() {
    const context = useContext(ChatWidgetContext);
    if (!context) {
        throw new Error("useChatWidget must be used within a ChatWidgetProvider");
    }
    return context;
}
