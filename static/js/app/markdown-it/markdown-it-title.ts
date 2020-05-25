type Token = {
    content: string; tag: string; type: string;
};
export default function (md: any, options: any) {
    md.core.ruler.push('title', ({ env, tokens }: {
        env: { document: Document }, tokens: Token[]
    }) => {
        if (env.document) {
            const h1s = tokens
                .filter((t) => t.tag === 'h1' && t.type === 'heading_open');
            if (h1s.length > 0) {
                h1s.map((t) => title(t, tokens)).forEach((title) => {
                    apply(title, env.document);
                });
            } else {
                apply(null, env.document);
            }
        }
    });
    function title(
        token: Token, tokens: Token[]
    ) {
        return tokens[tokens.indexOf(token) + 1].content;
    };
    function apply(
        title: string|null, document: Document
    ) {
        const titles = document.head.getElementsByTagName('title');
        for (let i=0; i<titles.length; i++) titles[i].remove();
        if (typeof title === 'string') {
            const element = document.createElement('title');
            element.textContent = title;
            document.head.prepend(element);
        }
        window.document.title = title ? title : original;
    }
    const original = window.document.title;
};
