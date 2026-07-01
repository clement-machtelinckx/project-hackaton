"use client";

import { ChatConversation } from "./chat-conversation";
import { DocumentList } from "@/components/documents/document-list";
import { useChat } from "@/lib/hooks/use-chat";
import type { KnowledgeDocumentSummary } from "@/lib/knowledge/types";

export function ChatShell({ documents }: { documents: KnowledgeDocumentSummary[] }) {
    const chat = useChat();

    return (
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <DocumentList documents={documents} />

            <section className="bg-muted/30 flex min-h-[650px] flex-col overflow-hidden rounded-xl border">
                <ChatConversation {...chat} />
            </section>
        </div>
    );
}
