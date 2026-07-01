import type { ChatSource } from "@/types/chat";

export function SourceBadge({ source }: { source: ChatSource }) {
    return (
        <div className="hover:bg-muted min-w-0 rounded-md px-2 py-2 transition-colors">
            <p className="truncate text-xs font-medium" title={source.documentTitle}>
                {source.documentTitle}
            </p>
            <p className="text-primary truncate text-xs" title={source.sectionTitle}>
                {source.sectionTitle}
            </p>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-[11px] leading-4 break-words">
                {source.excerpt}
            </p>
        </div>
    );
}
