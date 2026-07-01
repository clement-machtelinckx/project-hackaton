import { MarkdownContent } from "./markdown-content";
import { SourceList } from "./source-list";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

export function ChatMessage({ message }: { message: ChatMessageType }) {
    const isUser = message.role === "user";

    return (
        <article className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[88%] min-w-0 space-y-3 md:max-w-[78%] ${isUser ? "items-end" : "items-start"}`}
            >
                <div
                    className={
                        isUser
                            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3"
                            : "bg-card rounded-2xl rounded-bl-sm border px-4 py-3 shadow-sm"
                    }
                >
                    {isUser ? (
                        <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <MarkdownContent content={message.content} />
                    )}
                </div>

                {!isUser && message.sources && message.sources.length > 0 ? (
                    <SourceList sources={message.sources} />
                ) : null}
            </div>
        </article>
    );
}
