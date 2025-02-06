"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoValidation = exports.todoValidator = exports.loginValidator = exports.registerValidator = void 0;
const controller_dto_1 = require("../controllers/controller.dto");
const errors_1 = require("./errors");
const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const passwordRegex = /^(?=[A-Za-z0-9]{4,10}$)[A-Za-z0-9]+$/;
const registerValidator = (user) => {
    const { first_name, last_name, email, password } = user;
    if (!first_name)
        throw new errors_1.ClientError('first_name is required', 400);
    if (!last_name)
        throw new errors_1.ClientError('last_name is required', 400);
    if (!email)
        throw new errors_1.ClientError('email is required', 400);
    if (!password)
        throw new errors_1.ClientError('password is required', 400);
    if (!(emailRegex.test(email)))
        throw new errors_1.ClientError("Email is Invalid !", 400);
    if (!(passwordRegex.test(password)))
        throw new errors_1.ClientError("Password is Invalid", 400);
    return true;
};
exports.registerValidator = registerValidator;
const loginValidator = (user) => {
    const { email, password } = user;
    if (!email)
        throw new errors_1.ClientError('email is required', 400);
    if (!password)
        throw new errors_1.ClientError('password is required', 400);
    if (!(emailRegex.test(email)))
        throw new errors_1.ClientError("Email is Invalid !", 400);
    if (!(passwordRegex.test(password)))
        throw new errors_1.ClientError("Password is Invalid", 400);
    return true;
};
exports.loginValidator = loginValidator;
const todoValidator = (todo) => {
    const { isComplate, todo_title } = todo;
    if (!isComplate)
        throw new errors_1.ClientError('isComplate is Invalid', 400);
    if (!todo_title)
        throw new errors_1.ClientError('todo is Invalid', 400);
    return true;
};
exports.todoValidator = todoValidator;
class todoValidation extends controller_dto_1.ValidationTodo {
    validation_create(todo) { }
    validation_edit(todo) { }
    constructor() {
        super();
        this.validation_create = (todo) => {
            if (!(todo.todo_title))
                throw new errors_1.ClientError("Todo title is requered !", 400);
            return true;
        };
        this.validation_edit = (todo) => {
            const { todo_title, isComplate } = todo;
            if (!todo_title)
                throw new errors_1.ClientError("Todo title is requered !", 400);
            if (!isComplate)
                throw new errors_1.ClientError("Complate is requered !", 400);
            if (isComplate > 2 || isComplate < 1)
                throw new errors_1.ClientError("Complate value is invalid !", 400);
            return true;
        };
    }
}
exports.todoValidation = todoValidation;
