import { SourceBadge } from "./source-badge";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

export function ChatMessage({ message }: { message: ChatMessageType }) {
    const isUser = message.role === "user";

    return (
        <article className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[88%] space-y-3 md:max-w-[78%] ${isUser ? "items-end" : "items-start"}`}
            >
                <div
                    className={
                        isUser
                            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3"
                            : "bg-card rounded-2xl rounded-bl-sm border px-4 py-3 shadow-sm"
                    }
                >
                    <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
                </div>

                {!isUser && message.sources && message.sources.length > 0 ? (
                    <div className="grid gap-2" aria-label="Sources utilisées">
                        {message.sources.map((source) => (
                            <SourceBadge key={source.id} source={source} />
                        ))}
                    </div>
                ) : null}
            </div>
        </article>
    );
}
