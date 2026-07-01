import type { ChatSource } from "@/types/chat";

export function SourceBadge({ source }: { source: ChatSource }) {
    return (
        <div className="bg-muted/70 rounded-lg border p-3 text-xs">
            <p className="text-foreground font-medium">{source.documentTitle}</p>
            <p className="text-primary mt-1 font-medium">{source.sectionTitle}</p>
            <p className="text-muted-foreground mt-2 leading-relaxed">{source.excerpt}</p>
        </div>
    );
}
