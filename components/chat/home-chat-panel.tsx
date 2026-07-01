"use client";

import { ChatConversation } from "./chat-conversation";
import { useChat } from "@/lib/hooks/use-chat";

export function HomeChatPanel() {
    const chat = useChat();

    return (
        <section
            id="chat-panel"
            aria-labelledby="chat-panel-title"
            className="bg-muted/30 flex h-222 flex-col overflow-hidden rounded-xl border"
        >
            <h2 id="chat-panel-title" className="sr-only">
                Questions fréquentes
            </h2>
            <ChatConversation {...chat} />
        </section>
    );
}
