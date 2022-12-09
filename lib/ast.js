const esprima = require('esprima');
const acorn = require('acorn');
const { visit, builders: b } = require('ast-types');
const escodegen = require('escodegen');

const Import = (src, dst) => b.importDeclaration([b.importDefaultSpecifier(b.identifier(dst))], b.literal(src), 'value');

const ExportProperty = (value) => b.property.from({
  kind: 'init',
  key: b.identifier(value),
  value: b.identifier(value),
  shorthand: true,
});

const ExportAll = (src, dst) => b.exportAllDeclaration(b.literal(src), b.identifier(dst));
const ExportDefault = (src, dst) => 
  b.exportNamedDeclaration.from({
    declaration: null,
    specifiers: [
      b.exportSpecifier.from({ exported: b.identifier(dst), local: b.identifier('default') })
    ],
    source: b.literal(src),
  });


const RouterCall = router => b.callExpression(b.memberExpression.from({ object: b.identifier(router), property: b.identifier('routes') }), []);

function getAst(sourceCode) {
  const comments = [];
  const tokens = esprima.tokenize(sourceCode, { range: true, token: true, comment: true });
  const tree = acorn.parse(sourceCode, { ecmaVersion: 2020, sourceType: 'module', locations: true, ranges: true, onComment: comments  });
  const ast = escodegen.attachComments(tree, comments, tokens);
  return ast;
}

function stringify(ast, sourceCode) {
  const result = escodegen.generate(ast, { 
    format: { 
      compact: false,
      preserveBlankLines: true,
      indent: { 
        style: '  ', 
        base: 0, 
        adjustMultilineComment: true 
      } 
    },
    comment: true,
    sourceCode,
  });
  return result;
} 

function addImport(ast, entry, entryFrom = null) {
  let importCnt = 0;
  let lastRange = [null, null];
  visit(ast, {
    visitImportDeclaration(path) {
      const node = path.node;
      lastRange = node.range;
      importCnt += 1;
      this.traverse(path);
    },
  });

  if (importCnt > 0) {
    let i = 0;
    visit(ast, {
      visitImportDeclaration(path) {
        const node = path.node;
        if (i == Math.max(0, importCnt - 1)) {
          path.insertAfter(Import(entryFrom || `./${entry}`, entry));
          return false;
        }
        i += 1;
        this.traverse(path);
      },
    });
  }
  else {
    ast.body = [Import(`./${entry}`, entry), ...ast.body];
  }

  visit(ast, {
    visitImportDeclaration(path) {
      const node = path.node;
      if (!node.range) {
        node.range = lastRange;
      }
      this.traverse(path);
    },
  });
  return ast;
}

function modifyModelMap(ast, entry) {
  visit(ast, {
    visitExportNamedDeclaration(path) {
      const node = path.node;
      const declarations = node?.declaration?.declarations || [];
      for (const decl of declarations) {
        if (decl?.id?.name == 'ModelMap') {
          const { init } = decl;
          path.get('declaration', 'declarations', 0).get('init', 'properties').push(ExportProperty(entry));
        }
      }
      this.traverse(path);
    },
  });
  return ast;
}

function addExportToTop(ast, entry) {
  ast.body = [ExportAll(`./${entry}`, entry), ...ast.body];
  ast.body[0].range = [0, 0];
  return ast;
}

function addExportDefaultToTop(ast, entry) {
  ast.body = [ExportDefault(`./${entry}`, entry.charAt(0).toUpperCase() + entry.slice(1)), ...(ast.body || [])];
  ast.body[0].range = [0, 0];
  return ast;
}

function addRouter(ast, entry) {
  visit(ast, {
    visitVariableDeclaration(path) {
      const node = path.node;
      if (node?.declarations?.[0]?.id?.name == 'router') {
        path.get('declarations', 0, 'init', 'body', 'arguments', 0, 'elements').push(RouterCall(entry));
      }
      this.traverse(path);
    },
  });
  return ast;
}

module.exports = {
  addImport, stringify, getAst, modifyModelMap, addExportToTop, addExportDefaultToTop, addRouter,
};
