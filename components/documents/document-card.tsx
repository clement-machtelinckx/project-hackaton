import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { KnowledgeDocumentSummary } from "@/lib/knowledge/types";

export function DocumentCard({ document }: { document: KnowledgeDocumentSummary }) {
    return (
        <Card className="gap-4 py-4 shadow-none">
            <CardHeader className="gap-2 px-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                        <FileText className="size-4" aria-hidden="true" />
                    </div>
                    <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-[11px] font-medium">
                        Source locale
                    </span>
                </div>
                <CardTitle className="text-base">{document.shortTitle}</CardTitle>
                <CardDescription>{document.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 px-4">
                <span className="text-primary text-xs font-medium uppercase">
                    {document.category}
                </span>
                <p className="text-muted-foreground text-sm leading-5">{document.description}</p>
            </CardContent>
        </Card>
    );
}
