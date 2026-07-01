import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: "Accueil",
    description: siteConfig.description,
};

export default function HomePage() {
    return (
        <section aria-labelledby="home-title" className="py-20 md:py-28">
            <Container>
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-primary text-sm font-semibold tracking-widest uppercase">
                        Hackathon IA
                    </p>
                    <h1
                        id="home-title"
                        className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl"
                    >
                        Analysez vos documents avec l’IA
                    </h1>
                    <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8">
                        Importez vos documents, posez vos questions et obtenez des résumés, des
                        analyses et des recommandations basées sur leur contenu.
                    </p>

                    <Card className="mt-12 text-left">
                        <CardHeader>
                            <CardTitle>Votre espace documentaire</CardTitle>
                            <CardDescription>
                                Le module d’import et l’assistant IA seront ajoutés prochainement.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button type="button" disabled>
                                Bientôt disponible
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </section>
    );
}
