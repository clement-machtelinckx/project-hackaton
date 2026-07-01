import { ChatEmptyState } from "./chat-empty-state";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

type ChatConversationProps = {
    messages: ChatMessageType[];
    input: string;
    setInput: (value: string) => void;
    loading: boolean;
    error: string | null;
    sendMessage: (question?: string) => void;
    resetConversation: () => void;
};

export function ChatConversation({
    messages,
    input,
    setInput,
    loading,
    error,
    sendMessage,
    resetConversation,
}: ChatConversationProps) {
    return (
        <>
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
        </>
    );
}
