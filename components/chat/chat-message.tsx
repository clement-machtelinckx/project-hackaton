import type { ReactNode } from "react";
import { SourceBadge } from "./source-badge";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

// Rend le texte en convertissant les liens Markdown [texte](url) en liens cliquables.
// Le reste est affiché tel quel (le conteneur applique whitespace-pre-wrap).
const MARKDOWN_LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

function renderContent(content: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;

    for (const match of content.matchAll(MARKDOWN_LINK)) {
        const index = match.index ?? 0;
        if (index > lastIndex) nodes.push(content.slice(lastIndex, index));
        nodes.push(
            <a
                key={key++}
                href={match[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
            >
                {match[1]}
            </a>,
        );
        lastIndex = index + match[0].length;
    }
    if (lastIndex < content.length) nodes.push(content.slice(lastIndex));

    return nodes;
}

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
                    <p className="text-sm leading-6 whitespace-pre-wrap">
                        {isUser ? message.content : renderContent(message.content)}
                    </p>
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
