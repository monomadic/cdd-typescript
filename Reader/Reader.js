"use strict";
exports.__esModule = true;
var ts = require("typescript");
var fs = require("fs");
var Project_1 = require("../Project");
var Reader;
(function (Reader) {
    function listModels(fileName) {
        list(true, fileName);
    }
    Reader.listModels = listModels;
    function listRequests(fileName) {
        list(false, fileName);
    }
    Reader.listRequests = listRequests;
    function list(isModel, fileName) {
        var options = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS
        };
        var fileNames = [fileName];
        var program = ts.createProgram(fileNames, options);
        var text = fs.readFileSync(fileName, 'utf8');
        var models = [];
        var requests = [];
        for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
            var sourceFile = _a[_i];
            if (!sourceFile.isDeclarationFile) {
                ts.forEachChild(sourceFile, function (node) {
                    if (ts.isClassDeclaration(node) && node.name) {
                        var vars = findProperties(node);
                        var url = findFuncWithStringReturn("path", text, node);
                        var method = findFuncWithStringReturn("method", text, node);
                        var respErrorTypes = findResponseErrorTypes(node);
                        if (respErrorTypes.length == 2 && url && method) {
                            requests.push(new Project_1.Project.Request(node.name.escapedText.toString(), vars, url.replace("${this.", "{"), method, respErrorTypes[0], respErrorTypes[1]));
                        }
                        else {
                            models.push(new Project_1.Project.Model(node.name.escapedText.toString(), vars));
                        }
                    }
                });
            }
        }
        if (isModel) {
            console.log(JSON.stringify(models));
        }
        else {
            console.log(JSON.stringify(requests));
        }
    }
    function findResponseErrorTypes(node) {
        var result = [];
        if (node.heritageClauses != undefined) {
            var claus = node.heritageClauses[0];
            if (claus.types != undefined) {
                var l = claus.types[0].expression;
                if (l.escapedText == "APIRequest") {
                    if (claus.types[0].typeArguments.length == 2) {
                        var response_type = parseType(claus.types[0].typeArguments[0]);
                        if (response_type) {
                            result.push(response_type);
                        }
                        var error_type = parseType(claus.types[0].typeArguments[1]);
                        if (error_type) {
                            result.push(error_type);
                        }
                    }
                }
            }
        }
        return result;
    }
    function findFuncWithStringReturn(name, wholeText, node) {
        var result = undefined;
        ts.forEachChild(node, function (node) {
            if (ts.isMethodDeclaration(node)) {
                var func = node;
                var fName = node.name;
                if (fName.escapedText.toString() == name) {
                    func.body.statements.forEach(function (statement) {
                        if (ts.isReturnStatement(statement)) {
                            var s = statement;
                            result = wholeText.substring(s.expression.pos + 2, s.expression.end - 1);
                            // console.debug(s.expression)
                            // if (ts.isStringLiteral(s.expression)) {
                            //   const lit = s.expression as ts.StringLiteral
                            //   result = lit.text
                            // } else 
                            // if (ts.isIdentifier(s.expression)) {
                            //   const lit = s.expression as ts.Identifier
                            //   result = lit.escapedText.toString()
                            // }
                        }
                    });
                }
            }
        });
        return result;
    }
    function findProperties(node) {
        var vars = [];
        ts.forEachChild(node, function (node) {
            if (ts.isPropertyDeclaration(node)) {
                var prop = node;
                if (prop && prop.type) {
                    var name_1 = prop.name.escapedText.toString();
                    var type = parseType(prop.type);
                    var optional = prop.questionToken != undefined;
                    vars.push(new Project_1.Project.Variable(name_1, type, optional));
                }
            }
        });
        return vars;
    }
    function parseType(type) {
        switch (type.kind) {
            case ts.SyntaxKind.StringKeyword: {
                return "String";
            }
            case ts.SyntaxKind.NumberKeyword: {
                return "Float";
            }
            case ts.SyntaxKind.BooleanKeyword: {
                return "Bool";
            }
            case ts.SyntaxKind.TypeReference: {
                var obj = type;
                if (obj != undefined) {
                    var ident = obj.typeName;
                    if (ident != undefined) {
                        return ident.escapedText.toString();
                    }
                }
                return "";
            }
            case ts.SyntaxKind.ArrayType: {
                var obj = type;
                if (obj != undefined) {
                    return "[" + parseType(obj.elementType) + "]";
                }
                return "";
            }
            default: {
                return "";
            }
        }
    }
})(Reader = exports.Reader || (exports.Reader = {}));
