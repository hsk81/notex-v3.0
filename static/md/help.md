# NoTex Editor

NoTex is a simple to use [Markdown] editor, with built-in support for [MathJax] and [Blogger].

[Markdown] allows you to write using an *easy-to-read* and *easy-to-write* plain text format (which is then converted to HTML). [MathJax] displays mathematical formulas in web browsers, using the powerful [LaTeX] markup. And finally, with the [Blogger] integration it is possible to self-publish a blog post.

Any text written in the *left-hand-side* panel is immediately rendered on the *right-hand-side* one. Further, the toolbar on the left can be used to quickly access most of the available text editing features.

Below is yet another toolbar, that enables to search for a text string and also allows to toggle spell-checking. If you want to use the browser's *built-in* spell-checker or you have an extension like a [grammar](https://www.grammarly.com) checker, you may want to switch into the *simple mode* by clicking the lower-left button in the corner.

Below you find an example, which demonstrates most of the features NoTex offers. Just have a look and then simply open a new tab at www.notex.ch to get typing! ;)

[Markdown]: https://daringfireball.net/projects/markdown
[MathJax]: https://www.mathjax.org
[LaTex]: https://www.latex-project.org
[Blogger]: https://www.blogger.com

----

# The Probability of Co-Prime Integers

This post requires a basic understanding of *prime numbers*. In case you are not familiar with them, please go ahead and watch the video below:

@[youtube](mIStB5X4U8M)

## Random Co-Prime Integers

Alright, on our journey to investigate quantum algorithms[^1] like *Shor’s Period Finding* et al. sooner or later we will come upon the subject of so-called co-prime integers. Of particular interest for us is the question about the likelihood of two random integers being co-prime. Let us mold this interest of ours into crisp mathematics:

$$\begin{equation}
\text{co-prime}(x,y)\iff\text{gcd}(x,y)=1\label{EQ:P1}
\end{equation}$$

where $x,y∈\mathbb{Z}$ and $\text{gcd}(x,y)$ is the greatest common divisor, which can be calculated efficiently using the Euclidean algorithm. Well, this is actually pretty straight forward, but what about the probability of two random integers being co-prime?

$$\begin{equation}
\forall{x,y}\in\mathbb{Z}:\Pr{\{\text{co−prime}(x,y)\}}=\,?\label{EQ:P2}
\end{equation}$$

Well, what could the value of $\eqref{EQ:P2}$ be? The probability of $x$ and $y$ not being divisible by $2$ is $3/4$, by $3$ is $8/9$, by $5$ is $24/25$ and so on. So the total probability that two random integers do not share prime factors is then:

$$\begin{equation}\prod_{p\;\in\;\mathbb{P}}(1-1/p^2)
=1\Bigg/\prod_{p\;\in\;\mathbb{P}}{\bigg(1-\frac{1}{1/p^2}\bigg)}\\
=\zeta(2)=6\times\pi^{-2}\approx{60.79\%}\label{EQ:P3}\end{equation}$$

You can look up the proof yourself, but once having accepted this relation let us try to visualized it:

![$\Pr{\{\text{co-prime}(X=x,Y=y)\}\approx{60.82\%\pm{1.63}\%}}$][2]

As you can see, I have plotted three sample populations against each other, and the mean of $60.82\%$ is consistent with the calculated probability of $60.79\%$. Another aspect the plot reveals is the fact, that the standard deviation of $1.63\%$ is sitting quite tightly around the mean.

Our conclusion is that when we take two random integers, then we can with some confidence (larger than $50\%$) expect them to be co-prime.

```python
#!/usr/bin/env python
#####################################################################
# 2345678901234567890123456789012345678901234567890123456789012345678

import numpy as np
from math import gcd
from matplotlib import pyplot as pp

#####################################################################

def NEXT(n):
    return np.random.random_integers(2**n)
def CO_PRIME_PCT(m, n):
    return sum([1 if gcd(NEXT(n), NEXT(n))==1 \
        else 0 for i in range(m)]) / m
def SAMPLE(size, m=1000,n=48):
    return np.fromiter(map(lambda _: CO_PRIME_PCT(m,n), \ 
        range(size)), dtype=np.float)

s0 = SAMPLE(size=256)
s1 = SAMPLE(size=256)
s2 = SAMPLE(size=256)

mm = 0.0; std = 0.0
m0 = s0.mean(); mm += m0 / 3.0
m1 = s1.mean(); mm += m1 / 3.0
m2 = s2.mean(); mm += m2 / 3.0

std += s0.std() / 3.0
std += s1.std() / 3.0
std += s2.std() / 3.0

pp.plot(s0, s1, 'r.')
pp.plot(s1, s2, 'g.')
pp.plot(s2, s0, 'b.')

mm = float(100.0*mm)
std = float(100.0*std)

pp.legend([
    'Sample #1 vs #2', 'Sample #2 vs #3', 'Sample #3 vs #1'])
pp.title('Pr{co-prime(X=x,Y=y)} = ca. %0.2f%% ± %0.2f%%' \
    % (mm, std))

pp.grid()
pp.show()

#####################################################################
```

[^1]: algorithms based on quantum mechanical properties 

[2]: https://2.bp.blogspot.com/-iyOVARV299U/VsTGyzuh8iI/AAAAAAAAAQ0/Jc7JrnUC5G8/s640/random-x-vs-y.png
