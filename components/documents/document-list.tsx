import { Button } from "@/components/ui/button";
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
                    {documents.length} documents disponibles
                </p>
            </div>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {documents.map((document) => (
                    <DocumentCard key={document.id} document={document} />
                ))}
            </div>
            <Button type="button" variant="outline" className="w-full" disabled>
                Ajouter un document — bientôt
            </Button>
        </aside>
    );
}
