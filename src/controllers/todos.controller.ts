import fs from "fs/promises"
import path from "path";
import { readFile, readTodo, } from "../models/readFile";
import { JWTInterface, MyError, Todo, todoResultType, User } from "../types";
import { ClientError, GlobalError, ServerError } from "../utils/errors";
import { loginValidator, registerValidator, todoValidator } from "../utils/validators";
import { Auth, Request, Response } from "./controller.dto";
import { v4 as uuidv4, v4 } from "uuid";
import { tokenService } from "../lib/jwt/jwt";
import { writeTodo } from "../models/writeFile";
const { createToken, verifyToken } = tokenService;

export class todosControllers {
    GET_TODOS: (req: Request, res: Response) => Promise<void>;
    GET_TODO: (req: Request, res: Response, reqUrl: string) => Promise<void>;
    POST_TODO: (req: Request, res: Response) => Promise<void>;
    DELETE_TODO: (req: Request, res: Response, reqUrl: string) => void
    constructor() {
        this.POST_TODO = async function (req, res) {
            try {
                let newTodo: string = '';
                req.on("data", (chunk) => {
                    newTodo += chunk;
                });
                req.on("end", async () => {
                    try {
                        let todo: Todo = JSON.parse(newTodo);
                        let todos: Todo[] = await readTodo("todos.json");
                        const validator = todoValidator(todo);
                        if (validator) {
                            const token: string = req.headers.token as string;
                            const verify_token: JWTInterface = verifyToken(token) as JWTInterface;
                            todo.todo_title = (todo.todo_title.toLowerCase());
                            todo.isComplate = 1;
                            todo.todo_id = todos.length ? (todos[todos.length - 1].todo_id as number) + 1 : 1;
                            todo.user_id = verify_token.user_id;
                            
                            todos.push(todo);
                            const save_todo: boolean | void = await writeTodo("todos.json", todos);
                            if (!save_todo) throw new ServerError("Todo not saved");
                            const result: todoResultType = {
                                message: "Todo is saved",
                                status: 201,
                            }
                            res.statusCode = 201;
                            res.end(JSON.stringify(result));
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
        this.GET_TODOS = async function (req, res) {
            try {
                const todos: string | Todo[] = await readTodo("todos.json");
                res.writeHead(200, { "content-type": "application/json" });
                res.end(JSON.stringify(todos));
                console.log(todos);
            } catch (error) {
                let err: MyError = {
                    message: (error as MyError).message,
                    status: (error as MyError).status,
                };
                GlobalError(res, err);
            }
        };
        this.GET_TODO = async function (req, res, reqUrl) {
            try {
                let id: string = reqUrl.split("/").at(-1) as string;
                let todos: string | Todo[] = await readTodo("todos.json");
                if (typeof todos === "string") {
                    todos = JSON.parse(todos) as Todo[];
                }
                let index: number = todos.findIndex((todo: Todo) => todo.todo_id == Number(id));
                if (index < 0) throw new ClientError("Todo not found !", 404);
                res.writeHead(200, { "content-type": "application/json" });
                res.end(JSON.stringify(todos[index]));
            } catch (error) {
                let err: MyError = {
                    message: (error as MyError).message,
                    status: (error as MyError).status,
                };
                GlobalError(res, err);
            }
        };
        this.DELETE_TODO = async function (req, res, reqUrl) {
            try {
                try {
                    let todos: Todo[] = await readFile("todos.json") as Todo[];
                    let user: User = verifyToken(req.headers.token as string) as User

                    let todo = todos.find((u) => {
                        let id = req.url?.split("/").at(-1)

                        if (u.user_id == id) return u
                    })
                    let id = req.url?.split("/").at(-1)
                    if (user.user_id == todo?.user_id) {
                        let ChangedTodos = todos.filter((u) => u.user_id !== id)
                        
                        await writeTodo("todos.json", ChangedTodos)
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify({ message: "Todo deleted", status: 200 }))
                    } ;
                } catch (error) {
                    let err: MyError = {
                        message: (error as MyError).message,
                        status: (error as MyError).status,
                    };
                    GlobalError(res, err);
                }
            } catch (error) {
                let err: MyError = {
                    message: (error as MyError).message,
                    status: (error as MyError).status,
                };
                GlobalError(res, err);
            }
        }
    }
};

export default new todosControllers();