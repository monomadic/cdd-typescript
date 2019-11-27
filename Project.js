"use strict";
exports.__esModule = true;
var Project;
(function (Project) {
    var Request = /** @class */ (function () {
        function Request(name, vars, path, method, response_type, error_type) {
            this.name = name;
            this.vars = vars;
            this.path = path;
            this.method = method;
            this.response_type = response_type;
            this.error_type = error_type;
        }
        return Request;
    }());
    Project.Request = Request;
    function normalizeModelType(model) {
        model.vars.forEach(function (variable) {
            normalizeVariableType(variable);
        });
        return model;
    }
    Project.normalizeModelType = normalizeModelType;
    ;
    function normalizeRequestType(request) {
        request.vars.forEach(function (variable) {
            normalizeVariableType(variable);
        });
        return request;
    }
    Project.normalizeRequestType = normalizeRequestType;
    ;
    function normalizeVariableType(variable) {
        console.log(variable.type);
        variable.type = Variable.typeFrom(variable.type);
        console.log(variable.type);
        console.log("---------");
        return variable;
    }
    var Model = /** @class */ (function () {
        function Model(name, vars) {
            this.name = name;
            this.vars = vars;
        }
        return Model;
    }());
    Project.Model = Model;
    var Variable = /** @class */ (function () {
        function Variable(name, type, optional, value) {
            this.name = name;
            this.type = type;
            this.optional = optional;
            this.value = value;
        }
        Variable.prototype.toJSON = function () {
            var type = this.typeFor(this.type);
            return {
                name: this.name,
                type: type,
                optional: this.optional,
                value: this.value
            };
        };
        Variable.prototype.typeFor = function (type) {
            if (type[0] == "[") {
                return { Array: this.typeFor(type.substr(1, type.length - 2)) };
            }
            if (["String", "Bool", "Int", "Float"].includes(type)) {
                return type;
            }
            return { Complex: type };
        };
        Variable.fromJSON = function (json) {
            console.log("FROM CALLLED");
            var type = Variable.typeFrom(json["type"]);
            console.log(type);
            var variable = Object.create(Variable.prototype);
            return Object.assign(variable, json, {
                type: type
            });
        };
        Variable.typeFrom = function (type) {
            if (typeof type === 'string' || type instanceof String) {
                return type;
            }
            if (typeof type == 'object') {
                var obj = type;
                if (obj["Complex"] != undefined) {
                    return obj["Complex"];
                }
                if (obj["Array"] != undefined) {
                    return "[" + this.typeFrom(obj["Array"]) + "]";
                }
            }
            return "idk";
        };
        return Variable;
    }());
    Project.Variable = Variable;
})(Project = exports.Project || (exports.Project = {}));
