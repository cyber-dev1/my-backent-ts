export interface ServerConfig {
    PORT: number | string;
    dbFilePath: (fileName: string) => string;
};

export type User = {
    user_id?: number | string,
    id?: number,
    first_name?: string,
    last_name?: string,
    email: string,
    password: string,
};

export type Todo = {
    user_id?: string,
    todo_id?: number,
    todo_title: string,
    isComplate?: number,
};

export type verifyTokenType = {
    user_id: string,
    userAgent: string,
};

export type ErrorType = {
    message: string,
    status: number
};

export interface JWTInterface {
    user_id: string,
    user_agent: string
};

export type todoResultType = ErrorType & {todo?:Todo};

export type MyError = {
    message: string,
    status: number,
}