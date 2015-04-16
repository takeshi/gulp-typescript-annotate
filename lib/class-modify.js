var ts = require('typescript');
function transform(source) {
    var sourceFile = ts.createSourceFile('convert.source.ts', source, 2, true);
    ts.forEachChild(sourceFile, each);
    var className = null;
    function each(node) {
        switch (node.kind) {
            case 201:
                classDeclaration(node);
                break;
            case 135:
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
            if (node.kind === 135) {
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
