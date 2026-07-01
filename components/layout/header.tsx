import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Container } from "./container";
import { MenuBurger } from "./menuBurger";
import { NavLink } from "./navLink";

export function Header() {
    return (
        <header className="bg-background sticky top-0 z-50 border-b">
            <a
                href="#main"
                className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:rounded focus:px-4 focus:py-2"
            >
                Aller au contenu principal
            </a>
            <Container>
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
                            <GraduationCap className="size-5" aria-hidden="true" />
                        </span>
                        <Link
                            href="/"
                            className="font-heading text-lg font-semibold tracking-tight"
                        >
                            {siteConfig.name}
                        </Link>
                    </div>

                    <nav
                        aria-label="Navigation principale"
                        className="hidden items-center gap-6 md:flex"
                    >
                        <NavLink
                            href="/"
                            className="text-muted-foreground hover:text-foreground pb-1 text-sm font-medium transition-colors"
                            activeClassName="text-foreground"
                        >
                            Accueil
                        </NavLink>
                        <Badge
                            variant="secondary"
                            className="hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-flex"
                        >
                            Assistant pédagogique
                        </Badge>
                    </nav>

                    <div className="flex items-center gap-3">
                        <MenuBurger />
                    </div>
                </div>
            </Container>
        </header>
    );
}
