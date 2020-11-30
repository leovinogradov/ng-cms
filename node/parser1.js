const ts = require('typescript');
const fs = require('fs');

const syntaxKind = ts.SyntaxKind;

const source = fs.readFileSync(__dirname + '/../src/app/app-routing.module.ts', 'utf8'); // sourceText

const node = ts.createSourceFile(
  '', // 'x.ts',   // fileName
  source,
  ts.ScriptTarget.Latest // langugeVersion
);
console.log(node);
console.log('\n\n============');
for (let statement of node.statements) {
    // console.log("adi wuz here :) hehehe I see <3 You");
    console.log(syntaxKind[statement.kind], statement.kind);
    if (statement.kind == 254) {
        // Import declaration
        const importFiles = statement.importClause.namedBindings.elements.map(
            el => el.name.escapedText
         );
        const importLib = statement.moduleSpecifier.text;
        console.log('Import', importFiles, 'from', importLib);
    } else if (statement.kind == 245) {
        // Class Declaration
        const classDec = visitClassDeclaration(statement);
        console.log(classDec);
    }
}

function visitClassDeclaration(node) {
    if (node.decorators) {
        const expression = node.decorators[0].expression;
        const properties = expression.arguments[0].properties;
        const args = {}
        for (property of properties) {
            const { name, elements } = visitPropertyAssignment(property);
            args[name] = elements;
        }

        return {
            name: visitIdentifierObject(expression.expression),
            args
        };
    }
}

function visitIdentifierObject(node) {
    return node.escapedText
}

function visitPropertyAssignment(node) {
    const name = visitIdentifierObject(node.name);
    const elements = node.initializer.elements.map(x => {
        if (x.kind == 75) {
            return visitIdentifierObject(x)
        }
        return null;
    });
    return { name, elements }
}