<!-- ------------------------------------------------------------------
  -- CSS Styles: videos
  -- ----------------------------------------------------------------->

<style>
  .youtube-player {
    border: none;
    border-radius: 1mm;
    padding: 0;
    margin: 0 calc(0.5em + 0.5px);
    width: calc(100% - 1em - 1px);
  }
</style>

<!-- ------------------------------------------------------------------
  -- CSS Styles: fonts
  -- ----------------------------------------------------------------->

<link href="https://fonts.googleapis.com/css2?family=Habibi&display=swap"
      rel="stylesheet">

<style>
  body {
    font-family: Habibi, serif;
  }
</style>

<!-- ------------------------------------------------------------------
  -- CSS Styles: layout
  -- ----------------------------------------------------------------->

<style>
  h1 {
    text-align: center;
  }
  p {
    text-align: justify;
  }
</style>

<!-- ------------------------------------------------------------------
  -- CSS Styles: links
  -- ----------------------------------------------------------------->

<style>
  a.header-anchor {
    color: black;
    opacity: 3%;
  }
  a.header-anchor:hover {
    opacity: 100%;
  }
</style>

<!-- ------------------------------------------------------------------
  -- CSS Styles: headers
  -- ----------------------------------------------------------------->

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

<!-- ------------------------------------------------------------------
  -- CSS Styles: figures & videos
  -- ----------------------------------------------------------------->

<style>
  body {
    counter-reset: figures;
  }
  figure {
    margin: 1em;
  }
  figure img {
    border: none;
    width: 100%;
  }
  figure figcaption {
    counter-increment: figures;
    font-size: smaller;
    text-align: center;
    margin-top: 1em;
  }
  figure figcaption:before {
    content: 'Fig. ' counter(figures) ' – ';
  }
</style>

<!-- ------------------------------------------------------------------
  -- CSS Styles: code blocks
  -- ----------------------------------------------------------------->

<style>
  @import url('/static/css/lib/highlight/default-9.13.1.min.css')
</style>

<style>
  pre {
    background-color: #f5f5f5;
  }
  pre {
    padding: 1em;
    margin: 0.5em 1em;
    width: calc(100% - 4em);
  }
  pre {
    border-radius: 1mm;
  }
  pre {
    white-space: nowrap;
    overflow-x: auto;
  }
  pre code {
    white-space: pre;
  }
</style>

<style>
  @media print {
    pre {
      border-bottom: 1px solid black;
      border-left: none;
      border-right: none;
      border-top: 1px solid black;
      border-radius: 0;
    }
    pre code {
      white-space: pre-wrap;
    }
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
      startup: {
        ready: () => {
          MathJax.startup.defaultReady();
          MathJax.startup.promise.then(PATCH);
        }
      },
      tex: {
        inlineMath: [['$', '$'], ['$$', '$$']],
        tags: 'ams',
      },
      svg: {
        fontCache: 'global'
      },
      addMenu: [
        0, '', ''
      ]
    };
    script(
      'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js'
    );
  } else if (
    typeof window.MathJax.typesetPromise === 'function'
  ) {
    MathJax.startup.promise = MathJax.startup.promise.then(() => {
      MathJax.texReset(); return MathJax.typesetPromise().then(PATCH);
    });
  };
</script>

<!-- ------------------------------------------------------------------
  ## ##################################################################
  -- ----------------------------------------------------------------->
