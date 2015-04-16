import * as ts from 'typescript'

export function transform(source) {

    let sourceFile = ts.createSourceFile('convert.source.ts', source, ts.ScriptTarget.ES6, /*setParentNodes */ true);

    ts.forEachChild(sourceFile, each);

    var className = null;
    function each(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                classDeclaration(<ts.ClassDeclaration>node);
                break;
            case ts.SyntaxKind.Constructor:
                methodDeclaration(<ts.MethodDeclaration>node);
            default:
                next();
        }

        function next() {
            ts.forEachChild(node, each);
        }

        function classDeclaration(node: ts.ClassDeclaration) {
            className = node.name.text;
            next();
            className = null;
        }

        function methodDeclaration(node: ts.MethodDeclaration) {
            var types = node.parameters.map((parameter) => {
                return '\'' + (<any>parameter).name.text + '\'';
            });
            var source = '';
            if(node.kind === ts.SyntaxKind.Constructor){
              source += 'static $className = \'' + className +'\';';
            }
            source += 'static $inject = [' +types.join(',')+ '];';
            update(source);
        }

        function update(newSource: string) {
            var oldSource = sourceFile.text;
            var source = '/*<generated>*/';
            source += newSource;
            source += '/*</generated>*/';
            var end = node.getEnd();
            var pre = oldSource.substring(0,end);
            var post = oldSource.substring(end);
            var newSource = pre + source + post;

            let textRange: ts.TextChangeRange = {
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
