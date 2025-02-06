import { readFile } from "../models/readFile";
import { writeFile } from "../models/writeFile";
import { MyError, Todo, User } from "../types";
import { ClientError, GlobalError, ServerError } from "../utils/errors";
import { loginValidator, registerValidator } from "../utils/validators";
import { Auth, Request, Response } from "./controller.dto";
import { v4 as uuidv4, v4 } from "uuid";
import { tokenService } from "../lib/jwt/jwt";
const { createToken, verifyToken } = tokenService;

class AuthController extends Auth {
    register(req: Request, res: Response): void { };
    login(req: Request, res: Response): void { };
    constructor() {
        super();
        this.register = async (req: Request, res: Response) => {
            try {
                let newUser: string = '';
                req.on("data", (chunk) => {
                    newUser += chunk;
                });
                req.on("end", async () => {
                    try {
                        let user: User = JSON.parse(newUser);
                        const validator = registerValidator(user);

                        if (validator) {
                            let users: User[] = await readFile("users.json");
                            if (users.some((client: User) => client.email == user.email)) throw new ClientError("It's user already exists", 400);
                            user = {id: users.length ? (((users as User[]).at(-1) as User).id as number) + 1 : 1, ...user };
                            users.push(user);
                            let writeUser: boolean = await writeFile("users.json", users);
                            res.writeHead(201, {"content-type":"application/json"});
                            if (writeUser) return res.end(JSON.stringify({ message: "User successfully registered !", status: 201, accessToken: createToken({ user_id: user.id, userAgent: req.headers["user-agent"] }) }));
                            else throw new ServerError("user not saved yet !");
                        };

                    } catch (error) {
                        let err: MyError = {
                            message: (error as MyError).message,
                            status: (error as MyError).status,
                        };
                        GlobalError(res, err);
                    }
                });
            } catch (error) {
                let err: MyError = {
                    message: (error as MyError).message,
                    status: (error as MyError).status,
                };
                GlobalError(res, err);
            }
        };
        this.login = async (req: Request, res: Response) => {
            try {
                let user: string | User = '';
                req.on("data", (chunk) => {
                    user += chunk;
                });
                req.on("end", async () => {
                    try {
                        user = JSON.parse(user as string) ;
                        let validator = loginValidator(user as User);
                        if(validator){
                            let users:User[] = await readFile("users.json");
                            let findUser = users.find((client:User) => client.email == (user as User).email);
                            if(!findUser) throw new ClientError("User not found !", 404);
                            if(findUser?.password == (user as User).password) return res.end(JSON.stringify({ message: "User successfully Logined !", status: 200, accessToken: createToken({ user_id: (findUser as User).user_id , userAgent: req.headers["user-agent"] }) }));
                            else throw new ClientError("User not found !", 404);
                        }

                    } catch (error) {
                        let err: MyError = {
                            message: (error as MyError).message,
                            status: (error as MyError).status,
                        };
                        GlobalError(res, err);
                    }
                })
            } catch (error) {
                let err: MyError = {
                    message: (error as MyError).message,
                    status: (error as MyError).status,
                };
                GlobalError(res, err);
            }
        };
    }
};

export default new AuthController();