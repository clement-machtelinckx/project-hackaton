import { NextResponse } from "next/server";
import { z } from "zod";
import { retrieveContext } from "@/lib/knowledge/retrieve-context";
import {
    generateChatAnswer,
    LlmConfigurationError,
    LlmProviderError,
    LlmTimeoutError,
} from "@/lib/llm/client";
import { buildDocumentContext } from "@/lib/llm/prompts";
import { isSmallTalk, SMALL_TALK_ANSWER } from "@/lib/llm/small-talk";
import type { ChatResponse, ChatSource } from "@/types/chat";

export const runtime = "nodejs";

const messageSchema = z.object({
    role: z.enum(["user", "assistant"]),
    // 8000 car. pour absorber les réponses de l'assistant renvoyées dans l'historique
    // (une réponse à max_tokens=600 dépasse facilement 2000 car. en français).
    content: z.string().trim().min(1).max(8_000),
});

const chatRequestSchema = z
    .object({
        messages: z.array(messageSchema).min(1).max(12),
    })
    .refine((body) => body.messages.at(-1)?.role === "user", {
        message: "Le dernier message doit provenir de l’utilisateur.",
        path: ["messages"],
    });

function createExcerpt(content: string): string {
    return content.length <= 160 ? content : `${content.slice(0, 157).trimEnd()}…`;
}

export async function POST(request: Request) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Le corps de la requête doit être un JSON valide." },
            { status: 400 },
        );
    }

    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "La conversation envoyée est invalide." },
            { status: 400 },
        );
    }

    const messages = parsed.data.messages;
    const question = messages.at(-1)?.content ?? "";

    if (isSmallTalk(question)) {
        const response: ChatResponse = { answer: SMALL_TALK_ANSWER, sources: [] };
        return NextResponse.json(response);
    }

    const chunks = retrieveContext(question);

    if (chunks.length === 0) {
        const response: ChatResponse = {
            answer: "Je ne peux pas répondre à cette question. Vous pouvez vous rapprocher d'une personne de l'équipe pédagogique, ou créer une [demande de support](https://support.ynov.com/hc/fr/requests/new?ticket_form_id=14070109095057).",
            sources: [],
        };
        return NextResponse.json(response);
    }

    const sources: ChatSource[] = chunks.map((chunk) => ({
        id: chunk.id,
        documentId: chunk.documentId,
        documentTitle: chunk.documentTitle,
        sectionTitle: chunk.sectionTitle,
        excerpt: createExcerpt(chunk.content),
    }));

    try {
        const answer = await generateChatAnswer({
            messages,
            context: buildDocumentContext(chunks),
        });
        const response: ChatResponse = { answer, sources };
        return NextResponse.json(response);
    } catch (error: unknown) {
        if (error instanceof LlmConfigurationError) {
            return NextResponse.json({ error: error.message }, { status: 503 });
        }
        if (error instanceof LlmTimeoutError) {
            return NextResponse.json({ error: error.message }, { status: 504 });
        }

        console.error(
            "Erreur de génération Campus Copilot:",
            error instanceof LlmProviderError ? error.message : "Erreur serveur inconnue",
        );
        return NextResponse.json(
            { error: "Une erreur est survenue pendant la génération." },
            { status: 500 },
        );
    }
}
