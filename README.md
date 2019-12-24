# NoTex: A Markdown Editor

[NoTex] allows you to write blog posts using the [Markdown] notation, and once done the content can be published to the [Blogger.com] platform. Further, it enables you to craft complex mathematical formulae using [MathJax], which is handy for finance professionals or scientific authors. Another feature is its automatic syntax highlighting via [HighlightJS], which is useful to software developers and computer scientists.

## Installation

[NoTex] depends on [Node.js], [Python] 3 and [Redis]. Further, you require [Git] to fetch the source code and its submodules:

```bash
$ git clone https://hsk81@bitbucket.org/hsk81/notex.git notex.git
```
```
$ git submodule update --init
```

Switch to the repository and setup a Python virtual environment, which requires [virtualenv] to be available:

```bash
notex.git $ ./setup.sh
```

Then activate the virtual environment (causing the `[notex]` prefix to get  prepended to your prompt):

```bash
notex.git $ source bin/activate
```

Now, install the Python and Node.js dependencies, which may be require to have a proper development environment set-up (including some Python related headers):

```bash
[notex] $ ./setup.py install
```

```bash
[notex] $ npm install
```

## Execution

First, start an (already installed) `redis` instance – by for example running the following command (which is operating system dependent):

```bash
[notex] $ sudo systemctl start redis
```

Then, once all the necessary pre-requisites are installed and ready, start the application with the following `npm run-script`:

```bash
[notex] $ npm start
```

Now, navigate your browser to `http://localhost:8000` where a functional [NoTex] instance should get rendered.

## Development

First, start the application in *debug* mode:

```bash
[notex] $ npm run debug
```

Then, also to watch for code changes (of `*.ts` scripts) execute:

```bash
[notex] $ npm run watch
```

And finally, navigate again to `http://localhost:8000` to interact with the editor.

[Blogger.com]: https://www.blogger.com
[Git]: https://git-scm.com
[HighlightJS]: https://highlightjs.org
[Markdown]: https://daringfireball.net/projects/markdown
[MathJax]: https://www.mathjax.org
[Node.js]: https://nodejs.org
[NoTex]: https://www.notex.ch/editor
[Python]: https://www.python.org
[Redis]: https://redis.io
[virtualenv]: https://pypi.org/project/virtualenv
[TypeScript]: https://www.typescriptlang.org

<style>p { text-align: justify }</style>
