<!-- ------------------------------------------------------------------
  -- CSS Styles: body
  -- ----------------------------------------------------------------->

<link href="//fonts.googleapis.com/css2?family=Habibi&display=swap"
      rel="stylesheet"/>

<style>
  body {
    font-family: Habibi, serif;
    margin: 0 auto;
    max-width: 768px;
    padding: 0.5em;
  }
  body {
    columns: 160px 3;
  }
  @media print {
    body { columns: auto 3; }
  }
</style>

<!-- ------------------------------------------------------------------
  -- CSS Styles: headers
  -- ----------------------------------------------------------------->

<style>
  h1 {
    column-span: all;
    text-align: center;
  }
  h1, h2, h3, h4, h5, h6 {
    margin: 0.5em 0;
  }
</style>


<style>
  h1 {
    counter-reset: section;
  }
  h2 {
    counter-reset: sub-section;
  }
  h2:before {
    counter-increment: section;
    content: counter(section) " ";
  }
  h3:before {
    counter-increment: sub-section;
    content: counter(section) "."
             counter(sub-section) " ";
}
</style>

<style>
  a.header-anchor {
    color: black;
    opacity: 2%;
  }
  a.header-anchor:hover {
    opacity: 100%;
  }
</style>

<!-- ------------------------------------------------------------------
  -- CSS Styles: paragraphs
  -- ----------------------------------------------------------------->

<style>
  p {
    margin: 0.5em 0;
    text-align: justify;
  }
</style>

<!-- ------------------------------------------------------------------
  -- CSS Styles: tables
  -- ----------------------------------------------------------------->

<style>
  table {
    border-collapse: collapse;
    margin: 0 0.5em;
    width: calc(100% - 1em);
  }
  table>thead>tr {
    border-bottom: 2px solid black;
  }
  table>thead>tr>th {
    padding: 0.5em;
    text-align: left;
  }
  table>tbody>tr {
    border-bottom: 1px solid black;
  }
  table>tbody>tr>td {
    padding: 0.5em;
  }
</style>

<!-- ------------------------------------------------------------------
  -- CSS Styles: figures
  -- ----------------------------------------------------------------->

<style>
  figure {
    margin: 1em;
  }
  figure>img {
    border: none;
    border-radius: 1mm;
  }
  figure>img {
    width: 100%;
  }
  figure>figcaption {
    font-size: smaller;
    text-align: center;
    margin-top: 1em;
  }
</style>

<style>
  body {
    counter-reset: figures;
  }
  figure>figcaption {
    counter-increment: figures;
  }
  figure>figcaption:before {
    content: 'Fig. ' counter(figures) ' – ';
  }
</style>

<!-- ------------------------------------------------------------------
  -- CSS Styles: videos
  -- ----------------------------------------------------------------->

<style>
  .embed-responsive>iframe {
    border: none;
    border-radius: 1mm;
  }
  .embed-responsive>iframe {
    padding: 0;
    margin: 0 calc(1em + 0.5px);
    width: calc(100% - 2em - 1px);
  }
</style>

<!-- ------------------------------------------------------------------
  -- CSS Styles: code blocks
  -- ----------------------------------------------------------------->

<style>
  @import url('//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.0.0/build/styles/default.min.css')
</style>

<style>
  pre {
    border: none;
    border-radius: 1mm;
  }
  pre {
    background-color: #f5f5f5;
    margin: 1em;
    overflow-x: auto;
    padding: 1em;
    white-space: nowrap;
    width: calc(100% - 4em);
  }
  pre>code {
    white-space: pre;
  }
</style>

<style>
  @media print {
    pre>code {
      white-space: pre-wrap;
    }
  }
</style>

<!-- ------------------------------------------------------------------
  -- CSS Styles: blockquotes
  -- ----------------------------------------------------------------->

<style>
  blockquote {
    margin: 1em;
    width: calc(100% - 2em);
  }
</style>


<!-- ------------------------------------------------------------------
  -- CSS Styles: horizantal rules
  -- ----------------------------------------------------------------->

<style>
  hr {
    border: 1px solid black;
  }
</style>

<!-- ------------------------------------------------------------------
  -- MD Content
  -- ----------------------------------------------------------------->

${MD_CONTENT}

<!-- ------------------------------------------------------------------
  -- JS Script: MathJax
  -- ----------------------------------------------------------------->

<script>
  function script(url) {
    var element = document.createElement('script');
    element.src = url; element.async = true;
    document.head.appendChild(element);
  };
  if (
    typeof window.MathJax === 'undefined'
  ) {
    window.MathJax = {
      options: {
        renderActions: {
          addMenu: [], checkLoading: []
        }
      },
      startup: {
        ready: () => {
          MathJax.startup.defaultReady();
          if (typeof PATCH === 'function') {
            MathJax.startup.promise.then(PATCH);
          }
        }
      },
      tex: {
        inlineMath: [['$', '$'], ['$$', '$$']],
        tags: 'ams',
      },
      svg: {
        fontCache: 'global'
      },
    };
    script(
      '//cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
    );
  } else if (
    typeof window.MathJax.typesetPromise === 'function'
  ) {
    MathJax.startup.promise = MathJax.startup.promise.then(() => {
      MathJax.texReset(); return typeof PATCH === 'function'
        ? MathJax.typesetPromise().then(PATCH)
        : MathJax.typesetPromise();
    });
  };
</script>

<!-- ------------------------------------------------------------------
  ## ##################################################################
  -- ----------------------------------------------------------------->
