import { ChevronDown } from "lucide-react";
import { SourceBadge } from "./source-badge";
import type { ChatSource } from "@/types/chat";

type SourceListProps = {
    sources: ChatSource[];
};

const MAX_VISIBLE_SOURCES = 6;

export function SourceList({ sources }: SourceListProps) {
    const uniqueSources = Array.from(
        new Map(
            sources.map((source) => [`${source.documentId}:${source.sectionTitle}`, source]),
        ).values(),
    );

    if (uniqueSources.length === 0) return null;

    const visibleSources = uniqueSources.slice(0, MAX_VISIBLE_SOURCES);
    const remainingCount = uniqueSources.length - visibleSources.length;

    return (
        <details className="group bg-muted/30 max-w-full min-w-0 overflow-hidden rounded-lg border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-xs font-medium select-none [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 truncate">Sources utilisées · {uniqueSources.length}</span>
                <ChevronDown
                    className="size-4 shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                />
            </summary>

            <div className="space-y-1 border-t p-2">
                {visibleSources.map((source) => (
                    <SourceBadge
                        key={`${source.documentId}:${source.sectionTitle}`}
                        source={source}
                    />
                ))}

                {remainingCount > 0 ? (
                    <p className="text-muted-foreground px-2 py-1 text-[11px]">
                        + {remainingCount}{" "}
                        {remainingCount === 1
                            ? "autre passage utilisé"
                            : "autres passages utilisés"}
                    </p>
                ) : null}
            </div>
        </details>
    );
}
