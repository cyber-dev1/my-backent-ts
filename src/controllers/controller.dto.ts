import { IncomingMessage, ServerResponse } from "node:http";


export type Request = IncomingMessage ;
export type Response = ServerResponse<Request> ;

export abstract class Auth {
    abstract register(req:Request, res:Response) : void ;
    abstract login(req:Request,res:Response) : void ;
}