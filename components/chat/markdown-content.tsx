import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
    content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
    return (
        <div className="min-w-0 space-y-3 text-sm leading-6 break-words [&_a]:break-all [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                skipHtml
                components={{
                    h1: ({ children }) => (
                        <h1 className="mt-4 text-lg font-semibold first:mt-0">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="mt-4 text-base font-semibold first:mt-0">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="mt-4 text-sm font-semibold first:mt-0">{children}</h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="mt-3 text-sm font-semibold first:mt-0">{children}</h4>
                    ),
                    p: ({ children }) => <p className="leading-6">{children}</p>,
                    ul: ({ children }) => (
                        <ul className="my-2 ml-5 list-disc space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-2 ml-5 list-decimal space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => <li className="pl-1">{children}</li>,
                    strong: ({ children }) => (
                        <strong className="text-foreground font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => <em className="text-muted-foreground">{children}</em>,
                    hr: () => <hr className="border-border my-4" />,
                    blockquote: ({ children }) => (
                        <blockquote className="border-primary/40 text-muted-foreground my-3 border-l-4 pl-4 italic">
                            {children}
                        </blockquote>
                    ),
                    pre: ({ children }) => (
                        <pre className="my-3 max-w-full overflow-x-auto rounded-md bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100">
                            {children}
                        </pre>
                    ),
                    code: ({ children, className }) => (
                        <code
                            className={`bg-muted rounded px-1.5 py-0.5 font-mono text-xs ${className ?? ""}`}
                        >
                            {children}
                        </code>
                    ),
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-primary underline underline-offset-4"
                        >
                            {children}
                        </a>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
