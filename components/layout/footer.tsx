import Link from "next/link";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

export function Footer() {
    return (
        <footer className="bg-card border-t">
            <Container>
                <div className="text-muted-foreground flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {new Date().getFullYear()} {siteConfig.name} — Prototype Hackathon IA
                    </p>
                    <Link href="/" className="hover:text-foreground transition-colors">
                        Accueil
                    </Link>
                </div>
            </Container>
        </footer>
    );
}
