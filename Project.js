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
        return Variable;
    }());
    Project.Variable = Variable;
})(Project = exports.Project || (exports.Project = {}));
