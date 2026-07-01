"use client";

import { useState } from "react";
import { ChatEmptyState } from "./chat-empty-state";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { DocumentList } from "@/components/documents/document-list";
import type { KnowledgeDocumentSummary } from "@/lib/knowledge/types";
import type { ChatMessage as ChatMessageType, ChatResponse } from "@/types/chat";

function isChatResponse(value: unknown): value is ChatResponse {
    return (
        typeof value === "object" &&
        value !== null &&
        "answer" in value &&
        typeof value.answer === "string" &&
        "sources" in value &&
        Array.isArray(value.sources)
    );
}

function getErrorMessage(value: unknown): string | null {
    if (typeof value !== "object" || value === null || !("error" in value)) return null;
    return typeof value.error === "string" ? value.error : null;
}

export function ChatShell({ documents }: { documents: KnowledgeDocumentSummary[] }) {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function sendMessage(question = input) {
        const content = question.trim();
        if (!content || loading) return;
        if (content.length > 2_000) {
            setError("Votre message est trop long.");
            return;
        }

        const userMessage: ChatMessageType = {
            id: crypto.randomUUID(),
            role: "user",
            content,
        };
        const conversation = [...messages, userMessage];

        setMessages(conversation);
        setInput("");
        setError(null);
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: conversation.slice(-12).map(({ role, content: messageContent }) => ({
                        role,
                        content: messageContent,
                    })),
                }),
            });
            const payload: unknown = await response.json();

            if (!response.ok) {
                throw new Error(getErrorMessage(payload) ?? "Une erreur est survenue.");
            }
            if (!isChatResponse(payload)) {
                throw new Error("La réponse du service est invalide.");
            }

            setMessages((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: payload.answer,
                    sources: payload.sources,
                },
            ]);
        } catch (caughtError: unknown) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "Une erreur est survenue pendant la génération.",
            );
        } finally {
            setLoading(false);
        }
    }

    function resetConversation() {
        setMessages([]);
        setInput("");
        setError(null);
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <DocumentList documents={documents} />

            <section className="bg-muted/30 flex min-h-[650px] flex-col overflow-hidden rounded-xl border">
                <ChatHeader hasMessages={messages.length > 0} onReset={resetConversation} />

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {messages.length === 0 ? (
                        <ChatEmptyState onSelect={sendMessage} />
                    ) : (
                        <div className="space-y-5">
                            {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))}
                            {loading ? (
                                <div className="flex justify-start" role="status">
                                    <div className="bg-card text-muted-foreground rounded-2xl rounded-bl-sm border px-4 py-3 text-sm shadow-sm">
                                        Campus Copilot consulte les documents…
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>

                {error ? (
                    <p
                        className="bg-destructive/10 text-destructive mx-4 mb-3 rounded-md px-3 py-2 text-sm"
                        role="alert"
                    >
                        {error}
                    </p>
                ) : null}

                <ChatInput
                    value={input}
                    loading={loading}
                    onChange={setInput}
                    onSubmit={() => sendMessage()}
                />
            </section>
        </div>
    );
}
