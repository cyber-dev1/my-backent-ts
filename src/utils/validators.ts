import { ValidationTodo } from "../controllers/controller.dto";
import { Todo, User } from "../types";
import { ClientError } from "./errors";

const emailRegex:RegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const passwordRegex:RegExp = /^(?=[A-Za-z0-9]{4,10}$)[A-Za-z0-9]+$/ ;

export const registerValidator = (user:User):boolean|void => {
    const {first_name, last_name, email, password} = user;
    if(!first_name) throw new ClientError('first_name is required', 400);
    if(!last_name) throw new ClientError('last_name is required', 400);
    if(!email) throw new ClientError('email is required', 400);
    if(!password) throw new ClientError('password is required', 400);
    if(!(emailRegex.test(email))) throw new ClientError("Email is Invalid !", 400) ;
    if(!(passwordRegex.test(password))) throw new ClientError("Password is Invalid", 400)
    return true;
};
export const loginValidator = (user:User):boolean|void => {
    const {email, password} = user;
    if(!email) throw new ClientError('email is required', 400);
    if(!password) throw new ClientError('password is required', 400);
    if(!(emailRegex.test(email))) throw new ClientError("Email is Invalid !", 400) ;
    if(!(passwordRegex.test(password))) throw new ClientError("Password is Invalid", 400)
    return true;
};
export const todoValidator = (todo:Todo):boolean|void => {
    const {isComplate, todo_title } = todo;
    if(!isComplate) throw new ClientError('isComplate is Invalid', 400);
    if(!todo_title) throw new ClientError('todo is Invalid', 400);
    return true;
};

export class todoValidation extends ValidationTodo {
    validation_create(todo: Todo): boolean | void { }
    validation_edit(todo: Todo): boolean | void { }
    constructor() {
        super()
        this.validation_create = (todo: Todo): boolean | void => {
            if (!(todo.todo_title)) throw new ClientError("Todo title is requered !", 400)
            return true
        }
        this.validation_edit = (todo: Todo): boolean | void => {
            const { todo_title, isComplate } = todo
            if (!todo_title) throw new ClientError("Todo title is requered !", 400)
            if (!isComplate) throw new ClientError("Complate is requered !", 400)
            if (isComplate > 2 || isComplate < 1) throw new ClientError("Complate value is invalid !", 400)
            return true
        }
    }
}