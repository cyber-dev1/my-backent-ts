import fs from "fs/promises"
import {ServerConfiguration} from "../config"
import { Todo, User } from "../types";
const {dbFilePath} = ServerConfiguration;
export const writeFile = async (fileName:string, user:User[]):Promise<boolean> => {
    await fs.writeFile(dbFilePath(fileName), JSON.stringify(user, null , 4)) ;
    return true;
};
export const writeTodo = async (fileName:string, todo:Todo[]):Promise<boolean> => {
    await fs.writeFile(dbFilePath(fileName), JSON.stringify(todo, null , 4)) ;
    return true;
}