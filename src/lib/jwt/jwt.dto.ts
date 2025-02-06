import { JwtPayload } from "jsonwebtoken";
import { verifyTokenType } from "../../types";

export interface TokenServiceInterface {
    createToken : (payload:object) => string,
    verifyToken : (token:string) => JwtPayload | string | verifyTokenType, 
}