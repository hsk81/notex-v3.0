# NoTex: Blog Editor

With [NoTex][0] you can write blog posts using the [Markdown][1] notation, and once done the content can be published to [Blogger.com][2].

Further, it enables you to craft complex mathematical formulae using [MathJax][3], which will come handy when you are a finance professional or scientific author. Another feature is its automatic syntax highlighting via [HighlightJS][4], which is for the software developers and computers scientists among you.

## Installation

Pre-requisites: [NoTex][0] depends on Python 2, PostgreSQL 10 and Redis (plus possibly also Memcached). Further, you require GIT to get the source code:

```bash
$ git clone https://github.com/hsk81/notex-v3.0 notex.git
```

Switch to the cloned GIT repository and setup the Python environment. This step requires `virtualenv` - please make sure that you have `virtualenv` for `python` installed:

```bash
notex.git $ ./scripts/setup.sh
```

Then source to the virtual environment set-up for `python`, which if successful should prepend the `[notex]` string to your prompt:

```bash
notex.git $ source bin/activate
```

Now, you can install all the `python` dependencies with the help of the `setup.py` script. This step might require you to have a development environment set-up (including some headers for Python):

```bash
[notex] $ ./setup.py install
```

It's then time for you to install (and start) your `redis` and `memcached` instances, which has not been shown here. Please consult the corresponding resources for your operating system, to learn how that is accomplished.

## Execution

Once all the necessary pre-requisites have been installed, we can start the application with:

```bash
[notex] $ DEBUG=1 gunicorn -c config.py wsgi:app
```

Now, navigate to `http://localhost:8000` and you should see a fully functional [NoTex][0] instance.

## Transpilation

Since most of the code is written with [TypeScript] it is required to transpile it into JavaScript. For this first some dependencies (`@types`) from `package.json` need to be installed

```bash
$ npm install
```

Once, this step is done you can use `tsc` after editing a script to have it transpiled:

```bash
$ npm run build
```

Or, watching for any change in a script is also possible, which will then automatically run an incremental step:

```bash
$ npm run watch
```

[0]: https://www.notex.ch/editor
[1]: https://daringfireball.net/projects/markdown/
[2]: https://www.blogger.com/
[3]: https://www.mathjax.org/
[4]: https://highlightjs.org/

[TypeScript]: www.typescriptlang.org
