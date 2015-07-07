var ts = require('typescript');
function transform(source, typesafe, forceLowerCase) {
    if (typesafe === void 0) { typesafe = false; }
    if (forceLowerCase === void 0) { forceLowerCase = false; }
    var startCharacterTransform;
    if (forceLowerCase) {
        console.log("lower");
        startCharacterTransform = function (s) {
            return s.toLowerCase();
        };
    }
    else {
        startCharacterTransform = function (s) {
            return s;
        };
    }
    var sourceFile = ts.createSourceFile('convert.source.ts', source, 2, true);
    ts.forEachChild(sourceFile, each);
    var className = null;
    function each(node) {
        switch (node.kind) {
            case 201:
                classDeclaration(node);
                break;
            case 135:
                constructorDeclaration(node);
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
        function constructorDeclaration(node) {
            var types = node.parameters.map(function (parameter) {
                var typeRef = parameter.type;
                if (typesafe && typeRef) {
                    var typeName = typeRef.typeName;
                    if (typeName) {
                        return typeName.right.text;
                    }
                }
                return parameter.name.text;
            })
                .map(function (typeName) {
                if (/^I.*Service$/.test(typeName)) {
                    typeName = typeName.substring(1);
                    typeName = typeName.substring(0, typeName.length - 'Service'.length);
                    typeName = '$' + startCharacterTransform(typeName[0]) + typeName.substr(1);
                }
                else {
                    console.log(typeName);
                    typeName = startCharacterTransform(typeName[0]) + typeName.substr(1);
                }
                console.log(typeName);
                return '\'' + typeName + '\'';
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
