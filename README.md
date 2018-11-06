# NoTex: Blog Editor

With [NoTex][0] you can write blog posts using the [Markdown][1] notation, and once done the content can be published to [Blogger.com][2].

Further, it enables you to craft complex mathematical formulae using [MathJax][3], which will come handy when you are a finance professional or scientific author. Another feature is its automatic syntax highlighting via [HighlightJS][4], which is for the software developers and computers scientists among you.

## Local Installation

Pre-requisites: [NoTex][0] depends on Python 2, PostgreSQL 9.2, Redis and Memcached. Further, you require GIT to get the source code:

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

It's time for you to start your `postgresql`, `redis` and `memcached` instances. Once done, we can start the application:
```bash
[notex] $ DEBUG=1 DATABASE_URL=$DATABASE_URL DATABASE_RESET=1 gunicorn wsgi:app --reload --worker-class gevent
```

with for example `DATABASE_URL=postgres://notex@localhost:5432`, where you have to ensure that a `notex` *database user* exists! So, if any database has been created before, it will now be dropped and a new one will be created. Then, we still need to fill it with some basic structures with the help of the `__init__.sh` script:
```bash
[notex] $ ./script/db/__init__.sh
```

Later on, you can start the application via:
```bash
[notex] $ DEBUG=1 DATABASE_URL=$DATABASE_URL DATABASE_RESET=0 gunicorn wsgi:app --reload --worker-class gevent
```

where `DATABASE_RESET=0` can be omitted, since it is the default. Now navigate to `http://localhost:8000` and you should see a fully functional [NoTex][0] instance.

[0]: https://www.notex.ch/editor
[1]: https://daringfireball.net/projects/markdown/
[2]: https://www.blogger.com/
[3]: https://www.mathjax.org/
[4]: https://highlightjs.org/
