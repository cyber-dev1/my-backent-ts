import {Request, Response} from "../controllers/controller.dto"
import {MyError} from "../types";
export class ClientError extends Error {
    status : number;
    constructor(message:string, status:number){
        super(message) ;
        this.message = `Client Error ${message}`;
        this.status = status; 
    }
};
export class ServerError extends Error {
    status : number;
    constructor(message:string){
        super(message) ;
        this.message = `Client Error ${message}`;
        this.status = 500 ;
    }
}
export const GlobalError = (res:Response, err:MyError) => {
    let status = err.status || 500 ;
    res.statusCode = status ;
    return res.end(JSON.stringify({message : err.message, status}))
}
