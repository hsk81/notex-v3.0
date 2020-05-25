type Token = {
    content: string; tag: string; type: string;
};
export default function (md: any, options: any) {
    md.core.ruler.push('script', ({ env, tokens }: {
        env: { document: Document }, tokens: Token[]
    }) => {
        if (env.document) tokens
            .filter((t) => t.type === 'html_block' && t.content)
            .filter((t) => t.content.trimLeft().match(/^<script>/i))
            .filter((t) => t.content.trimRight().match(/<\/script>$/i))
            .map((t) => script(t)).forEach((s) => run(s, env.document));
    });
    function script(
        token: Token
    ) {
        return token.content
            .trimLeft().replace(/^<script>/ig, '')
            .trimRight().replace(/<\/script>$/ig, '');
    };
    function run(
        script: string, document: Document
    ) {
        const element = document.createElement('script');
        element.type = 'text/javascript';
        element.textContent = script;
        document.head.appendChild(element);
        document.head.removeChild(element);
    }
};
