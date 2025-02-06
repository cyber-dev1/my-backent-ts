import { IncomingMessage } from "node:http";
import { ClientError, GlobalError } from "../utils/errors";
import { MyError, User } from "../types";
import { Response } from "../controllers/controller.dto";
import { tokenService } from "../lib/jwt/jwt";
import { readFile } from "./readFile";
import {verifyTokenType} from "../types"
export const checkToken = async (req: IncomingMessage, res:Response) => {
    try {
        let token = req.headers.token;
        if (!token) throw new ClientError("Unauthorized", 401);
        let verifyToken:verifyTokenType = tokenService.verifyToken(token as string) as verifyTokenType;
        let users = await readFile("users.json") ;
        if(!(users.some((user:User) => user.user_id == verifyToken.user_id))) throw new ClientError("token is Invalid !", 401);
        if(!(verifyToken.userAgent == req.headers["user-agent"])) throw new ClientError("token is Invalid", 401)
        return true;
    } catch (error) {
        let err: MyError = {
            message: (error as MyError).message,
            status: (error as MyError).status,
        };
        GlobalError(res, err);
    }
};