import * as ts from 'typescript';

export function transform(source, typesafe = false, forceLowerCase = false) {

    let startCharacterTransform:(s:string)=>string;

    if (forceLowerCase) {
        startCharacterTransform = (s:string) => {
            return s.toLowerCase();
        };
    } else {
        startCharacterTransform = (s:string) => {
            return s;
        };
    }

    let sourceFile = ts.createSourceFile('convert.source.ts', source, ts.ScriptTarget.ES6, /*setParentNodes */ true);

    ts.forEachChild(sourceFile, each);

    var className = null;

    function each(node:ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                classDeclaration(<ts.ClassDeclaration>node);
                break;
            case ts.SyntaxKind.Constructor:
                constructorDeclaration(<ts.ConstructorDeclaration>node);
            default:
                next();
        }

        function next() {
            ts.forEachChild(node, each);
        }

        function classDeclaration(node:ts.ClassDeclaration) {
            className = node.name.text;
            next();
            className = null;
        }

        function constructorDeclaration(node:ts.ConstructorDeclaration) {

            var types = node.parameters.map((parameter) => {
                var typeRef = <ts.TypeReferenceNode> parameter.type;
                if (typesafe && typeRef) {
                    var typeName = <ts.QualifiedName>typeRef.typeName;
                    if (typeName) {
                        return (<ts.Identifier>typeName.right).text;
                    }
                }
                return (<ts.Identifier>parameter.name).text;
            })
                .map((typeName:string) => {
                    if (/^I.*Service$/.test(typeName)) {
                        typeName = typeName.substring(1);
                        typeName = typeName.substring(0, typeName.length - 'Service'.length);
                        typeName = '$' + startCharacterTransform(typeName[0]) + typeName.substr(1);
                    } else {
                        typeName = startCharacterTransform(typeName[0]) + typeName.substr(1);
                    }
                    return '\'' + typeName + '\'';
                });

            var source = '';
            if (node.kind === ts.SyntaxKind.Constructor) {
                source += 'static $className = \'' + className + '\';';
            }
            source += 'static $inject = [' + types.join(',') + '];';
            update(source);
        }

        function update(newSource:string) {
            var oldSource = sourceFile.text;
            var source = '/*<generated>*/';
            source += newSource;
            source += '/*</generated>*/';
            var end = node.getEnd();
            var pre = oldSource.substring(0, end);
            var post = oldSource.substring(end);
            var newSource = pre + source + post;

            let textRange:ts.TextChangeRange = {
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
