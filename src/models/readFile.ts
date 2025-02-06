import fs from "fs/promises"
import {ServerConfiguration} from "../config"
import { Todo, User } from "../types";
const {dbFilePath} = ServerConfiguration;
export const readFile = async (fileName:string):Promise<[] | User[]> => {
    let read:User[]|string = await fs.readFile(dbFilePath(fileName), "utf-8") ;
    return read ? JSON.parse(read) : []
};
export const readTodo = async (fileName:string):Promise<Todo[]|[]> => {
    let read:Todo[]|string = await fs.readFile(dbFilePath(fileName), "utf-8") ;
    return read ? JSON.parse(read) : []
};
