import path from "path";
import {config} from "dotenv"
import { ServerConfig } from "./types";
config();

export enum METHODS_ENUM {
    CREATE = 'POST',
    READ = 'GET',
    UPDATE = 'PUT',
    DELETE = 'DELETE'
}

export const ServerConfiguration:ServerConfig = {
    PORT : process.env.PORT || 8001,
    dbFilePath : (fileName:string) => path.resolve("db", fileName),
}