# Markdown Syntax

## Headers

Underlined:
```md
Header 1
========
```
```md
Header 2
--------
```

Prefixed (closing `#`'s are optional):
```md
# Header 1 #
```
```md
## Header 2 ##
```
```md
###### Header 6
```

## Phrase emphasis

```md
*italic* **bold** _italic_ __bold__
```

## Images

Inline (titles are optional):
```md
![alt text](/path/img.jpg "Title")
```

## Links

Inline:
```md
An [example](http://url.com/ "Title")
```

Reference-style labels (titles are optional):
```md
An [example][id]. Then, anywhere else in the doc, define the link:

[id]: http://example.com/  "Title"
```

## Lists

Ordered, without paragraphs:
```md
1.  Foo
2.  Bar
```

Unordered, with paragraphs:
```md
*   A list item.

    With multiple paragraphs.

*   Bar
```

You can nest them:
```md
*   Abacus
    * answer
*   Bubbles
    1.  bunk
    2.  bupkis
        * BELITTLER
    3. burper
*   Cunning
```

## Blockquotes
```md
> Email-style angle brackets
> are used for blockquotes.

> > And, they can be nested.

> #### Headers in blockquotes
>
> * You can quote a list.
> * Etc.
```

## Code Spans
```md
`<code>` spans are delimited
by backticks.

You can include literal backticks
like `` `this` ``.
```

## Preformatted Code Blocks

Indent every line of a code block by at least 4 spaces or 1 tab.
```md
This is a normal paragraph.

    This is a preformatted
    code block.
```

## Horizontal Rules

Three or more dashes or asterisks:
```md
---

* * *

- - - -
```

## Manual Line Breaks
End a line with two or more spaces:
```md
Roses are red,
Violets are blue.
```
