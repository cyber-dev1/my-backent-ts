import { sign, verify } from "jsonwebtoken";
import { TokenServiceInterface } from "./jwt.dto";

export const tokenService:TokenServiceInterface = {
    createToken:(payload:object) => sign(payload, process.env.TOKEN_KEY as string, {expiresIn: "7d"}) ,
    verifyToken:(token:string) => verify(token , process.env.TOKEN_KEY as string)
}