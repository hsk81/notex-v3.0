export default function (md: any, options: any) {
    md.renderer.rules['html_block'] = function (
        tokens: Array<{ content: string }>, idx: number,
        options: any, env: { document: Document }
    ) {
        let script = tokens[idx].content.trim();
        if (script.match(/^<script>/i) &&
            script.match(/<\/script>$/i)
        ) {
            script = script
                .replace(/^<script>/ig, '')
                .replace(/<\/script>$/ig, '');
            if (env.document) {
                return run(script, env.document);
            }
        }
        return tokens[idx].content;
    };
    function run(
        script: string, document: Document
    ) {
        const element = document.createElement('script');
        element.type = 'text/javascript';
        element.textContent = script;
        document.head.appendChild(element);
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
        return '';
    }
};
