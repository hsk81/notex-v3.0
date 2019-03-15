CodeMirror.defineMode('notex-md', function (config) {
    return CodeMirror.multiplexingMode(CodeMirror.getMode(config, 'gfm'), {
        mode: CodeMirror.getMode(config, 'text/x-stex'),
        open: '{{', close: '}}'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-stex'),
        open: '$$', close: '$$'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-stex'),
        open: '$', close: '$'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-sh'),
        open: '```bash', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-ceylon'),
        open: '```ceylon', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-cmake'),
        open: '```cmake', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-csharp'),
        open: '```csharp', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/css'),
        open: '```css', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-cython'),
        open: '```cython', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-c++src'),
        open: '```c++', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-csrc'),
        open: '```c', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-dockerfile'),
        open: /```(?:docker|dockerfile)/, close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-erlang'),
        open: '```erlang', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-spreadsheet'),
        open: '```exel', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-fortran'),
        open: '```fortran', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'x-shader/x-fragment'),
        open: '```fragment', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-fsharp'),
        open: '```fsharp', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-go'),
        open: '```go', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-haskell'),
        open: '```haskell', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/html'),
        open: '```html', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'message/http'),
        open: '```http', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/javascript'),
        open: '```javascript', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-java'),
        open: '```java', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'jinja2'),
        open: /```jinja2?/, close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-julia'),
        open: '```julia', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-stex'),
        open: '```latex', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-less'),
        open: '```less', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-lua'),
        open: '```lua', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-markdown'),
        open: '```markdown', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-mathematica'),
        open: '```mathematica', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-octave'),
        open: '```matlab', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'mllike'),
        open: '```ml', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-nginx-conf'),
        open: '```nginx', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-objectivec'),
        open: '```objective-c', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-ocaml'),
        open: '```ocaml', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-octave'),
        open: '```octave', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-perl'),
        open: '```perl', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-php'),
        open: '```php', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-python'),
        open: '```python', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-squirrel'),
        open: '```squirrel', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-rst'),
        open: '```rst', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-rsrc'),
        open: '```r', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-sass'),
        open: '```sass', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-scss'),
        open: '```scss', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-scala'),
        open: '```scala', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-sh'),
        open: '```sh', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-sql'),
        open: '```sql', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-spreadsheet'),
        open: '```spreadsheet', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-swift'),
        open: '```swift', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/typescript'),
        open: '```typescript', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-vertex'),
        open: '```vertex', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'application/xml'),
        open: '```xml', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-yaml'),
        open: '```yaml', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/x-vb'),
        open: '```vb', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/vbscript'),
        open: '```vbscript', close: '```'
    }, {
        mode: CodeMirror.getMode(config, 'text/plain'),
        open: '```', close: '```'
    });
});
//# sourceMappingURL=md-editor-mode.js.map