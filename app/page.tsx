import type { Metadata } from "next";
import { MessageCircle, Sparkles } from "lucide-react";
import { HomeChatPanel } from "@/components/chat/home-chat-panel";
import { Container } from "@/components/layout/container";
import { DocumentList } from "@/components/documents/document-list";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getDocumentSummaries } from "@/lib/knowledge/get-documents";

export const metadata: Metadata = {
    title: "Copilote étudiant",
    description: siteConfig.description,
};

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
                        Assistant pédagogique intelligent
                    </p>
                    <h1
                        id="home-title"
                        className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl"
                    >
                        Bienvenue sur {siteConfig.name}
                    </h1>
                    <p className="mt-4 max-w-xl text-lg leading-8 text-teal-50/90">
                        Qu&apos;avez-vous envie de savoir sur votre formation aujourd&apos;hui ?
                        Posez votre question : l&apos;assistant s&apos;appuie sur les documents
                        pédagogiques disponibles pour vous répondre.
                    </p>
                    <Button asChild size="lg" variant="secondary" className="mt-6 gap-2">
                        <a href="#chat-panel">
                            <MessageCircle className="size-4" aria-hidden="true" />
                            Discuter avec l&apos;assistant
                        </a>
                    </Button>
                </section>

                <div className="mt-8 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                    <DocumentList documents={documents} />

                    <HomeChatPanel />
                </div>
            </Container>
        </div>
    );
}
