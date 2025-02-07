import fs from "fs/promises"
import path from "path";
import { readFile, readTodo, } from "../models/readFile";
import { ErrorType, JWTInterface, MyError, Todo, todoResultType, User } from "../types";
import { ClientError, GlobalError, ServerError } from "../utils/errors";
import { loginValidator, registerValidator, todoValidation, todoValidator } from "../utils/validators";
import { Auth, Request, Response, TodoRequests } from "./controller.dto";
import { v4 as uuidv4, v4 } from "uuid";
import { tokenService } from "../lib/jwt/jwt";
import { writeTodo } from "../models/writeFile";
const { createToken, verifyToken } = tokenService;

export class todosControllers extends TodoRequests {
    get_todos(req: Request, res: Response): void { };
    get_todo(req: Request, res: Response, reqUrl: string): void { };
    post_todos(req: Request, res: Response): void { };
    delete_todo(req: Request, res: Response, reqUrl: string): void { };
    edit_todo(req: Request, res: Response): void { };
    constructor() {
        super();
        this.post_todos = async function (req, res) {
            try {
                let todo_chunk: string = "";
                req.on("data", (chunk) => { todo_chunk += chunk });
                req.on("end", async () => {
                    try {
                        const todo: Todo = JSON.parse(todo_chunk);
                        const todos: Todo[] = await (readTodo("todos.json")) as Todo[];
                        const validation_todo: todoValidation = new todoValidation();
                        if (validation_todo.validation_create(todo)) {
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
                        }
                    } catch (error) {
                        GlobalError(res, (error as ErrorType))
                    }
                })
            } catch (error) {
                GlobalError(res, (error as ErrorType))
            }
        };
        this.get_todos = async function (req, res) {
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
        this.get_todo = async function (req, res, reqUrl) {
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
        this.delete_todo = async function (req, res,) {
            try {
                const todos: Todo[] = await (readTodo("todos.json")) as Todo[];
                const todo_id: number = Number((req.url as string).trim().split("/").at(-1));
                if (!todo_id) throw new ClientError("NOT FOUND", 404);
                const find_index_todo: number = todos.findIndex((t: Todo) => t.todo_id == todo_id);
                if (find_index_todo == -1) throw new ClientError("TODOS NOT FOUND", 404);
                const token: string = req.headers.token as string;
                const verify_token: JWTInterface = verifyToken(token) as JWTInterface;
                const todo: Todo = todos[find_index_todo];
                if (todo.user_id != verify_token.user_id) throw new ClientError("Todo is not deleted", 400);
                todos.splice(find_index_todo, 1);
                const updatedTodos = todos.map((todo, index) => ({
                    ...todo,
                    todo_id: index + 1
                }));
                const delete_todo: boolean | void = await writeTodo("todos.json", updatedTodos);
                if (!delete_todo) throw new ServerError("Todo is not deleted");
                const result: todoResultType = {
                    message: "Todo is deleted",
                    status: 200,
                }
                res.statusCode = 200;
                res.end(JSON.stringify(result));

            } catch (error) {
                GlobalError(res, (error as ErrorType));
            }

        };
        this.edit_todo = async function (req, res) {
            try {
                let todo_chunk: string = "";
                req.on("data", (chunk) => { todo_chunk += chunk });
                req.on("end", async () => {
                    try {
                        const change_todo: Todo = JSON.parse(todo_chunk);
                        const todos: Todo[] = await (readTodo("todos.json")) as Todo[];
                        const validation_todo: todoValidation = new todoValidation();
                        if (validation_todo.validation_edit(change_todo)) {
                            const todo_id: number = Number((req.url as string).trim().split("/").at(-1));
                            if (!todo_id) throw new ClientError("NOT FOUND OGabek", 404);
                            const find_index_todo: number = todos.findIndex((t: Todo) => t.todo_id == todo_id);
                            if (find_index_todo == -1) throw new ClientError("ogabek's Todo NOT FOUND", 404);
                            const token: string = req.headers.token as string;
                            const verify_token: JWTInterface = verifyToken(token) as JWTInterface;
                            const todo: Todo = todos[find_index_todo];
                            if (todo.user_id != verify_token.user_id) throw new ClientError("Todo is not edit ogabek", 400);
                            todo.todo_title = change_todo.todo_title;
                            todo.isComplate = change_todo.isComplate;
                            const save_todo: boolean | void = await writeTodo("todos.json", todos);
                            if (!save_todo) throw new ServerError("Todo is not changed ogabek");
                            const result: todoResultType = {
                                message: "Todo is changed",
                                status: 200,
                            }
                            res.statusCode = 200;
                            res.end(JSON.stringify(result));
                        }
                    } catch (error) {
                        GlobalError(res, (error as ErrorType));
                    }
                })
            } catch (error) {
                GlobalError(res, (error as ErrorType));
            }
        }
    }
};

export default new todosControllers();