"use client";

import { MessageCircle } from "lucide-react";
import { ChatConversation } from "./chat-conversation";
import { useChatWidget } from "./chat-widget-context";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet";
export function ChatWidget() {
    const { open, setOpen, chat } = useChatWidget();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    type="button"
                    size="icon-lg"
                    className="fixed right-6 bottom-6 z-50 size-14 rounded-full shadow-lg"
                    aria-label="Ouvrir l'assistant Campus Copilot"
                >
                    <MessageCircle className="size-6" aria-hidden="true" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>Campus Copilot</SheetTitle>
                    <SheetDescription>
                        Posez vos questions sur la formation et le parcours.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex min-h-0 flex-1 flex-col">
                    <ChatConversation {...chat} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
