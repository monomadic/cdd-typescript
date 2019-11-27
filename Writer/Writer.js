"use strict";
exports.__esModule = true;
var ts = require("typescript");
var fs = require("fs");
var Writer;
(function (Writer) {
    function insertRequest(request, fileName) {
        var resStatements = [];
        var file = sourceFile(fileName);
        file.statements.forEach(function (statement) {
            resStatements.push(statement);
        });
        var decl = makeRequest(request);
        resStatements.push(decl);
        var newFile = ts.updateSourceFileNode(file, resStatements);
        write(fileName, newFile);
    }
    Writer.insertRequest = insertRequest;
    function insertModel(model, fileName) {
        var resStatements = [];
        var file = sourceFile(fileName);
        file.statements.forEach(function (statement) {
            resStatements.push(statement);
        });
        var decl = makeModel(model);
        resStatements.push(decl);
        var newFile = ts.updateSourceFileNode(file, resStatements);
        write(fileName, newFile);
    }
    Writer.insertModel = insertModel;
    function updateRequest(request, fileName) {
        var resStatements = [];
        var file = sourceFile(fileName);
        var decl = makeRequest(request);
        file.statements.forEach(function (statement) {
            var cl = statement;
            if (cl && cl.name.escapedText == request.name) {
                resStatements.push(decl);
            }
            else {
                resStatements.push(statement);
            }
        });
        var newFile = ts.updateSourceFileNode(file, resStatements);
        write(fileName, newFile);
    }
    Writer.updateRequest = updateRequest;
    function updateModel(model, fileName) {
        var resStatements = [];
        var file = sourceFile(fileName);
        var decl = makeModel(model);
        file.statements.forEach(function (statement) {
            var cl = statement;
            if (cl && cl.name.escapedText == model.name) {
                resStatements.push(decl);
            }
            else {
                resStatements.push(statement);
            }
        });
        var newFile = ts.updateSourceFileNode(file, resStatements);
        write(fileName, newFile);
    }
    Writer.updateModel = updateModel;
    function deleteClass(name, fileName) {
        var resStatements = [];
        var file = sourceFile(fileName);
        file.statements.forEach(function (statement) {
            var cl = statement;
            if (cl && cl.name.escapedText == name) {
            }
            else {
                resStatements.push(statement);
            }
        });
        var newFile = ts.updateSourceFileNode(file, resStatements);
        write(fileName, newFile);
    }
    Writer.deleteClass = deleteClass;
    function sourceFile(fileName) {
        var fileNames = [fileName];
        var text = fs.readFileSync(fileName, 'utf8');
        return ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
    }
    function write(fileName, file) {
        var printer = ts.createPrinter({
            newLine: ts.NewLineKind.LineFeed
        });
        var result = printer.printNode(ts.EmitHint.Unspecified, file, file);
        fs.writeFile(fileName, result, function (err) { });
    }
    function makeModel(model) {
        var vars = makeVars(model.vars, false);
        return ts.createClassDeclaration(undefined, undefined, model.name, undefined, undefined, vars);
    }
    function makeRequest(request) {
        var vars = makeVars(request.vars, true);
        var stringType = ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
        var methodBody = ts.createBlock([ts.createReturn(ts.createLiteral(request.method))], 
        /*multiline*/ true);
        var method = ts.createMethod(undefined, undefined, undefined, "method", undefined, undefined, [], stringType, methodBody);
        var urlString = request.path.replace("{", "${this.");
        var url = ts.createIdentifier("`" + urlString + "`");
        var urlBody = ts.createBlock([ts.createReturn(url)], 
        /*multiline*/ true);
        var path = ts.createMethod(undefined, undefined, undefined, "path", undefined, undefined, [], stringType, urlBody);
        vars.push(method);
        vars.push(path);
        var extendTypes = [typeFor(request.response_type), typeFor(request.error_type)];
        var type = ts.createExpressionWithTypeArguments(extendTypes, ts.createIdentifier("APIRequest"));
        var hertiage = ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [type]);
        return ts.createClassDeclaration(undefined, undefined, request.name, undefined, [hertiage], vars);
    }
    function makeVars(variables, needSuper) {
        var parameters = variables.map(function (variable) {
            return makeParameter(variable);
        });
        var vars = variables.map(function (variable) {
            return makeVar(variable);
        });
        var superCall = ts.createCall(ts.createSuper(), /*typeArgs*/ undefined, []);
        var superCallArr = needSuper ? [ts.createStatement(superCall)] : [];
        var constructorBody = ts.createBlock(superCallArr, 
        /*multiline*/ true);
        var constructor = ts.createConstructor(undefined, undefined, parameters, constructorBody);
        vars.push(constructor);
        return vars;
    }
    function makeParameter(variable) {
        var paramType = typeFor(variable.type);
        return ts.createParameter(undefined, undefined, undefined, variable.name, undefined, paramType, undefined);
    }
    function typeFor(type) {
        if (type[0] == "[") {
            return ts.createArrayTypeNode(typeFor(type.substr(1, type.length - 2)));
        }
        if (type == "String") {
            return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
        }
        if (type == "Bool") {
            return ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
        }
        if (type == "Float") {
            return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
        }
        // if (type == "Int") {
        //   return ts.createTypeReferenceNode("Int",[])
        // }
        return ts.createTypeReferenceNode(type, []);
    }
    function makeVar(variable) {
        var type = typeFor(variable.type);
        return ts.createProperty(undefined, undefined, variable.name, undefined, type, undefined);
    }
})(Writer = exports.Writer || (exports.Writer = {}));
