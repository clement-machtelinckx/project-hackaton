import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "./container";
import { MenuBurger } from "./menuBurger";
import { NavLink } from "./navLink";

export function Header() {
    return (
        <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
            <a
                href="#main"
                className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:rounded focus:px-4 focus:py-2"
            >
                Aller au contenu principal
            </a>
            <Container>
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="font-semibold tracking-tight">
                            {siteConfig.name}
                        </Link>
                        <span className="bg-secondary text-secondary-foreground hidden rounded-full px-2 py-1 text-xs sm:inline">
                            Démo hackathon
                        </span>
                    </div>

                    <nav
                        aria-label="Navigation principale"
                        className="hidden items-center gap-6 md:flex"
                    >
                        <NavLink
                            href="/"
                            className="text-muted-foreground hover:text-foreground text-base transition-colors"
                        >
                            Accueil
                        </NavLink>
                    </nav>

                    <div className="flex items-center gap-2">
                        <MenuBurger />
                    </div>
                </div>
            </Container>
        </header>
    );
}
