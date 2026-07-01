import { NextResponse } from "next/server";
import { z } from "zod";
import { retrieveContext } from "@/lib/knowledge/retrieve-context";
import { generateChatAnswer, MistralClientError } from "@/lib/llm/client";
import { buildDocumentContext } from "@/lib/llm/prompts";
import type { MistralErrorCode } from "@/lib/llm/types";
import type { ChatResponse, ChatSource } from "@/types/chat";

export const runtime = "nodejs";

const MISTRAL_ERROR_RESPONSES: Record<MistralErrorCode, { status: number; message: string }> = {
    MISTRAL_NOT_CONFIGURED: {
        status: 503,
        message: "Le service IA n’est pas configuré.",
    },
    MISTRAL_AUTHENTICATION_ERROR: {
        status: 503,
        message: "La clé Mistral est absente ou invalide.",
    },
    MISTRAL_ACCESS_ERROR: {
        status: 503,
        message: "Le compte Mistral ne permet pas d’utiliser ce modèle.",
    },
    MISTRAL_RATE_LIMIT: {
        status: 429,
        message: "Le service IA reçoit trop de demandes. Réessayez dans un instant.",
    },
    MISTRAL_TIMEOUT: {
        status: 504,
        message: "La réponse de l’IA a pris trop de temps.",
    },
    MISTRAL_NETWORK_ERROR: {
        status: 502,
        message: "Le service Mistral est temporairement inaccessible.",
    },
    MISTRAL_EMPTY_RESPONSE: {
        status: 502,
        message: "Le service IA n’a retourné aucune réponse exploitable.",
    },
    MISTRAL_PROVIDER_ERROR: {
        status: 502,
        message: "Une erreur est survenue auprès du fournisseur IA.",
    },
};

const messageSchema = z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(2_000),
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
    const chunks = retrieveContext(question);

    if (chunks.length === 0) {
        const response: ChatResponse = {
            answer: "Je ne trouve pas cette information dans les documents actuellement disponibles.",
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
        if (error instanceof MistralClientError) {
            const publicError = MISTRAL_ERROR_RESPONSES[error.code];
            return NextResponse.json(
                { error: publicError.message },
                { status: publicError.status },
            );
        }

        console.error("Erreur serveur inconnue pendant la génération Campus Copilot");
        return NextResponse.json(
            { error: "Une erreur est survenue pendant la génération." },
            { status: 500 },
        );
    }
}
