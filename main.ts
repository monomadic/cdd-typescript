import ts = require("typescript");
import fs = require("fs");

import { Project } from "./Project";
import { Reader } from "./Reader/Reader";
import { Writer } from "./Writer/Writer";


const program = require('commander');


if (process.argv.length < 3) {
  console.error("Wrong command")
}
else {
  switch (process.argv[2]) {
    case "list-models": {
        Reader.listModels(process.argv[3])
        break
    }
    case "list-requests": {
      Reader.listRequests(process.argv[3])
      break
    }
    case "delete-request": {
      Writer.deleteClass(process.argv[4],process.argv[3])
      break
    }
    case "delete-model": {
      Writer.deleteClass(process.argv[4],process.argv[3])
      break
    }
    case "insert-model": {
      const model = JSON.parse(process.argv[4]) 
      
      Writer.insertModel(Project.normalizeModelType(model),process.argv[3])
      break
    }
    case "update-model": {
      const model = JSON.parse(process.argv[4])

      Writer.updateModel(Project.normalizeModelType(model),process.argv[3])
      break
    }
    case "insert-request": {
      const request = JSON.parse(process.argv[4])
      Writer.insertRequest(Project.normalizeRequestType(request),process.argv[3])
      break
    }
    case "update-request": {
      const request = JSON.parse(process.argv[4])
      Writer.updateRequest(Project.normalizeRequestType(request),process.argv[3])
      break
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

