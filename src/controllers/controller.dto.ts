import { IncomingMessage, ServerResponse } from "node:http";
import { Todo } from "../types";

export type Request = IncomingMessage ;
export type Response = ServerResponse<Request> ;

export abstract class Auth {
    abstract register(req:Request, res:Response) : void ;
    abstract login(req:Request,res:Response) : void ;
};

export abstract class TodoRequests {
    abstract post_todos(req:Request, res:Response) : void ;
    abstract get_todos(req:Request, res:Response) : void ;
    abstract get_todo(req:Request, res:Response, reqUrl:string) : void ;
    abstract delete_todo(req:Request, res:Response, reqUrl:string) : void ;
    abstract edit_todo(req:Request, res:Response) : void ;
};

export abstract class ValidationTodo {
    abstract validation_create(todo:Todo): boolean | void;
    abstract validation_edit(todo:Todo): boolean | void;
    constructor(){};
}
