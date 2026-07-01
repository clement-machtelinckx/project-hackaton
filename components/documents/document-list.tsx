import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import { Separator } from "@/components/ui/separator";
import type { KnowledgeDocumentSummary } from "@/lib/knowledge/types";
import { DocumentCard } from "./document-card";

export function DocumentList({ documents }: { documents: KnowledgeDocumentSummary[] }) {
    return (
        <aside aria-labelledby="documents-title" className="space-y-4">
            <div>
                <h2 id="documents-title" className="font-semibold">
                    Base documentaire
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                    {documents.length}{" "}
                    {documents.length === 1 ? "document indexé" : "documents indexés"}
                </p>
            </div>
            <Separator />
            <ScrollAreaPrimitive.Root
                className="relative max-h-[32rem] overflow-hidden"
                type="auto"
            >
                <ScrollAreaPrimitive.Viewport
                    className="max-h-[32rem] w-full"
                    aria-label="Documents indexés"
                    tabIndex={0}
                >
                    <div className="grid min-w-0 gap-3 pr-3 sm:grid-cols-2 lg:grid-cols-1">
                        {documents.map((document) => (
                            <DocumentCard key={document.id} document={document} />
                        ))}
                    </div>
                </ScrollAreaPrimitive.Viewport>
                <ScrollAreaPrimitive.Scrollbar
                    orientation="vertical"
                    className="flex w-2.5 touch-none p-px select-none"
                >
                    <ScrollAreaPrimitive.Thumb className="bg-border relative flex-1 rounded-full" />
                </ScrollAreaPrimitive.Scrollbar>
                <ScrollAreaPrimitive.Corner />
            </ScrollAreaPrimitive.Root>
            <p className="text-muted-foreground text-xs leading-relaxed">
                Les réponses sont générées à partir de ces documents.
            </p>
        </aside>
    );
}
