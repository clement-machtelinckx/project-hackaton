import type { Metadata } from "next";
import { ChatShell } from "@/components/chat/chat-shell";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { getDocumentSummaries } from "@/lib/knowledge/get-documents";

export const metadata: Metadata = {
    title: "Copilote étudiant",
    description: siteConfig.description,
};

export default function HomePage() {
    const documents = getDocumentSummaries();

    return (
        <section aria-labelledby="home-title" className="py-8 md:py-12">
            <Container>
                <div className="mb-8 max-w-3xl">
                    <p className="text-primary text-sm font-semibold tracking-widest uppercase">
                        Prototype Hackathon IA
                    </p>
                    <h1
                        id="home-title"
                        className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl"
                    >
                        Vos documents pédagogiques, enfin faciles à interroger.
                    </h1>
                    <p className="text-muted-foreground mt-4 text-lg leading-8">
                        Campus Copilot recherche les passages pertinents dans les sources locales et
                        s’appuie sur eux pour répondre à vos questions.
                    </p>
                </div>

                <ChatShell documents={documents} />
            </Container>
        </section>
    );
}
