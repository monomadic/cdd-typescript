export module Project {
    export class Request {
        name: string
        vars: Variable[]
        path:string
        method:string
        response_type:string
        error_type:string
        constructor(name:string,vars:Variable[],path:string,method:string, response_type:string,error_type:string) {
          this.name = name
          this.vars = vars
          this.path = path
          this.method = method
          this.response_type = response_type
          this.error_type = error_type
        }
      }

    export class Model {
        name: string
        vars: Variable[]
        constructor(name:string,vars:Variable[]) {
          this.name = name
          this.vars = vars
        }
    }
    export class Variable {
        name: string
        type: string
        optional:boolean
        value?: string
        constructor(name:string,type:string,optional:boolean,value?:string) {
          this.name = name
          this.type = type
          this.optional = optional
          this.value = value
        }
    }
}