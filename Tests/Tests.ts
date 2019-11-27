import { Project } from "../Project"; 


class TestSBuilder {
    models:Project.Model[]
    requests:Project.Request[]
    constructor(models:Project.Model[],requests:Project.Request[]) {
        this.models = models
        this.requests = requests
    }


    build(): string {
        const requestsText = this.requests.map((request,index,arr) => {

            const modelName = request.response_type.replace("[","").replace("]","")
            const model = this.models.find((model)=>{
                return model.name ==modelName
            })

            if (model != undefined) {
                const modelParams = this.buildParams(model.vars)
                const params = this.buildParams(request.vars)
                return `it('${request.name}', () => {
                    const request = new ${request.name}(${params})
                    let responseShould = JSON.stringify([new ${model.name}(${modelParams})])
                    const result = request.send(new MockClient(responseShould),(response)=>{
                        expect(response).to.be(responseShould)
                    },(error)=>{
                        fail(error)
                    })
                });`
            }
            else {
                return ""
            }
        },null)


        return `
import { expect } from 'chai';
import { MockClient } from './MockClient';
import { APIBase, APIRequest, Int, ResponceEmpty } from '../API/APIBase'
import { Requests } from '../API/Requests'
import { fail } from 'assert';

        describe('Requests Test', () => {
            ${requestsText}
        });`
    }
    
    buildParams(vars: Project.Variable[]): string {
        return vars.map((variable)=> {
            return this.defaultArgumentForType(variable.type)
        }).join(",")
    }
    
    defaultArgumentForType(type:String): string {
        switch (type) {
            case "Bool": return "APIFaker.bool"
            case "Int": return "APIFaker.int"
            case "String": return "APIFaker.string"
            case "Float": return "APIFaker.float"
            default:
                if (type.length > 0) {
                    if (type[0] == "[") {
                        var newType = type.substr(1,type.length - 2)
                        return "[" + this.defaultArgumentForType(newType) + "]"
                    }
    
                }
                else {
                    return "null"
                }
        }
    }
}

