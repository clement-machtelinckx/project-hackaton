import type { Metadata } from "next";
import { MessageCircle, Sparkles } from "lucide-react";
import { AskAssistantButton } from "@/components/chat/ask-assistant-button";
import { Container } from "@/components/layout/container";
import { DocumentList } from "@/components/documents/document-list";
import { siteConfig } from "@/config/site";
import { getDocumentSummaries } from "@/lib/knowledge/get-documents";

export const metadata: Metadata = {
    title: "Copilote étudiant",
    description: siteConfig.description,
};

const SUGGESTIONS = [
    "Quels sont les objectifs du cursus CDA ?",
    "Comment valider un bloc de compétences ?",
    "Quelles sont les modalités d’évaluation ?",
    "Que se passe-t-il en cas d’absence ?",
] as const;

export default function HomePage() {
    const documents = getDocumentSummaries();

    return (
        <div className="py-8 md:py-12">
            <Container>
                <section
                    aria-labelledby="home-title"
                    className="hero-pattern relative overflow-hidden rounded-2xl px-6 py-12 text-white md:px-12 md:py-16"
                >
                    <p className="flex items-center gap-2 text-sm font-semibold tracking-widest text-teal-200 uppercase">
                        <Sparkles className="size-4" aria-hidden="true" />
                        Prototype Hackathon IA
                    </p>
                    <h1
                        id="home-title"
                        className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl"
                    >
                        Bienvenue sur {siteConfig.name}
                    </h1>
                    <p className="mt-4 max-w-xl text-lg leading-8 text-teal-50/90">
                        Qu&apos;avez-vous envie de savoir sur votre formation aujourd&apos;hui ? Posez
                        votre question, l&apos;assistant s&apos;appuie sur vos documents pédagogiques
                        pour vous répondre.
                    </p>
                    <AskAssistantButton
                        size="lg"
                        variant="secondary"
                        className="mt-6 gap-2"
                    >
                        <MessageCircle className="size-4" aria-hidden="true" />
                        Discuter avec l&apos;assistant
                    </AskAssistantButton>
                </section>

                <div className="mt-8 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                    <DocumentList documents={documents} />

                    <section
                        aria-labelledby="suggestions-title"
                        className="bg-card rounded-xl border p-6"
                    >
                        <h2 id="suggestions-title" className="font-semibold">
                            Questions fréquentes
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Sélectionnez une question pour lancer la conversation.
                        </p>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {SUGGESTIONS.map((suggestion) => (
                                <AskAssistantButton
                                    key={suggestion}
                                    question={suggestion}
                                    variant="outline"
                                    className="h-auto justify-start py-3 text-left whitespace-normal"
                                >
                                    {suggestion}
                                </AskAssistantButton>
                            ))}
                        </div>
                    </section>
                </div>
            </Container>
        </div>
    );
}
