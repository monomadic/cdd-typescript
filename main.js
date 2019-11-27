"use strict";
exports.__esModule = true;
var Project_1 = require("./Project");
var Reader_1 = require("./Reader/Reader");
var Writer_1 = require("./Writer/Writer");
var program = require('commander');
if (process.argv.length < 3) {
    console.error("Wrong command");
}
else {
    switch (process.argv[2]) {
        case "list-models": {
            Reader_1.Reader.listModels(process.argv[3]);
            break;
        }
        case "list-requests": {
            Reader_1.Reader.listRequests(process.argv[3]);
            break;
        }
        case "delete-request": {
            Writer_1.Writer.deleteClass(process.argv[4], process.argv[3]);
            break;
        }
        case "delete-model": {
            Writer_1.Writer.deleteClass(process.argv[4], process.argv[3]);
            break;
        }
        case "insert-model": {
            var model = JSON.parse(process.argv[4]);
            Writer_1.Writer.insertModel(Project_1.Project.normalizeModelType(model), process.argv[3]);
            break;
        }
        case "update-model": {
            var model = JSON.parse(process.argv[4]);
            Writer_1.Writer.updateModel(Project_1.Project.normalizeModelType(model), process.argv[3]);
            break;
        }
        case "insert-request": {
            var request = JSON.parse(process.argv[4]);
            Writer_1.Writer.insertRequest(Project_1.Project.normalizeRequestType(request), process.argv[3]);
            break;
        }
        case "update-request": {
            var request = JSON.parse(process.argv[4]);
            Writer_1.Writer.updateRequest(Project_1.Project.normalizeRequestType(request), process.argv[3]);
            break;
        }
    }
}
// function parse<ResponseType,ErrorType>(text: string, callback:(result:ResponseType)=>void, onError:(error:ErrorType)=>void) {
//   try {
//       callback(JSON.parse(text)); 
//   }
//   catch (e) {
//     console.debug("error")
//       onError(JSON.parse(text))
//   }
// };
// parse<Project.Model,Project.Request>('{"name":"ololo","vars":[]}',(model)=>{
// const m = model as Project.Model
// console.debug(typeof(m))
// console.debug(model)
// },(request)=>{console.debug(request)})
