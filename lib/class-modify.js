var ts = require('typescript');
function transform(source) {
    var sourceFile = ts.createSourceFile('convert.source.ts', source, ts.ScriptTarget.ES6, true);
    ts.forEachChild(sourceFile, each);
    var className = null;
    function each(node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                classDeclaration(node);
                break;
            case ts.SyntaxKind.Constructor:
                methodDeclaration(node);
            default:
                next();
        }
        function next() {
            ts.forEachChild(node, each);
        }
        function classDeclaration(node) {
            className = node.name.text;
            next();
            className = null;
        }
        function methodDeclaration(node) {
            var types = node.parameters.map(function (parameter) {
                return '\'' + parameter.name.text + '\'';
            });
            var source = '';
            if (node.kind === ts.SyntaxKind.Constructor) {
                source += 'static $className = \'' + className + '\';';
            }
            source += 'static $inject = [' + types.join(',') + '];';
            update(source);
        }
        function update(newSource) {
            var oldSource = sourceFile.text;
            var source = '/*<generated>*/';
            source += newSource;
            source += '/*</generated>*/';
            var end = node.getEnd();
            var pre = oldSource.substring(0, end);
            var post = oldSource.substring(end);
            var newSource = pre + source + post;
            var textRange = {
                newLength: (newSource.length - sourceFile.text.length),
                span: {
                    start: node.getEnd(),
                    length: 0
                }
            };
            sourceFile = sourceFile.update(newSource, textRange);
        }
    }
    return sourceFile.text;
}
exports.transform = transform;
