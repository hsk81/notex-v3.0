# NoTex: Blog Editor

With [NoTex][0] you can write blog posts using the [Markdown][1] notation, and once done the content can be published to [Blogger.com][2].

Further, it enables you to craft complex mathematical formulae using [MathJax][3], which will come handy when you are a finance professional or scientific author. Another feature is its automatic syntax highlighting via [HighlightJS][4], which is for the software developers and computers scientists among you.

## Installation

Pre-requisites: [NoTex][0] depends on Python 2, PostgreSQL 10 and Redis (plus possibly also Memcached). Further, you require GIT to get the source code:

```bash
$ git clone https://github.com/hsk81/notex-v3.0 notex.git
```

Switch to the cloned GIT repository and setup the Python environment. This step requires `virtualenv2` - please make sure that you have `virtualenv2` for `python2` installed:

```bash
notex.git $ ./scripts/setup.sh
```

Then source to the virtual environment set-up for `python2`, which if successful should prepend the `[notex]` string to your prompt:

```bash
notex.git $ source bin/activate
```

Now, you can install all the `python2` dependencies with the help of the `setup.py` script. This step might require you to have a development environment set-up (including some headers for Python):

```bash
[notex] $ ./setup.py install
```

It's then time for you to install (and start) your `postgresql`, `redis` and `memcached` instances, which has not been shown here. Please consult the corresponding resources for your operating system, to learn how that is accomplished.

## Execution

Once all the necessary pre-requisites have been installed, we can start the application with:

```bash
[notex] $ DEBUG=1 DATABASE_RESET=1 DATABASE_URL=postgres://notex@localhost:5432 gunicorn --config gunicorn.py wsgi:app
```

where you have to ensure that a `notex` *database user* exists! So, if any database has been created before, it will now be dropped and a new one will be re-created. Then, we still need to fill it with some basic structures using the `__init__.sh` script:

```bash
[notex] $ ./script/db/__init__.sh
```

Later on, you can start the application much simpler via:

```bash
[notex] $ export DATABASE_URL=postgres://notex@localhost:5432
```
```bash
[notex] $ DEBUG=1 gunicorn --config gunicorn.py wsgi:app
```

Now, navigate to `http://localhost:8000` and you should see a fully functional [NoTex][0] instance.

## Transpilation

Since most of the code is written with [TypeScript] it is required to transpile it into JavaScript. For this first some dependencies (`@types`) from `package.json` need to be installed

```bash
$ npm install
```

Once, this step is done you can use `tsc` after editing a script to have it transpiled:

```bash
$ tsc --build tsconfig.json
```

Or, watching for any change in a script is also possible, which will then automatically run an incremental step:

```bash
$ tsc --watch
```

[0]: https://www.notex.ch/editor
[1]: https://daringfireball.net/projects/markdown/
[2]: https://www.blogger.com/
[3]: https://www.mathjax.org/
[4]: https://highlightjs.org/

[TypeScript]: www.typescriptlang.org
