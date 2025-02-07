import Joi from "joi";
import { ValidationTodo } from "../controllers/controller.dto";
import { Todo, User } from "../types";
import { ClientError } from "./errors";

export const registerValidator = (user: User): boolean | void => {
    const userSchema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(/^(?=[A-Za-z0-9]{4,10}$)[A-Za-z0-9]+$/).required(),
    });
    const { error } = userSchema.validate(user);
    if (error) {
        throw new ClientError(error.details[0].message, 400);
    }
    return true;
};

export const loginValidator = (user: User): boolean | void => {
    const userLoginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(/^(?=[A-Za-z0-9]{4,10}$)[A-Za-z0-9]+$/).required(),
    });
    const { error } = userLoginSchema.validate(user);
    if (error) {
        throw new ClientError(error.details[0].message, 400);
    }
    return true;
};
export const todoValidator = (todo: Todo): boolean | void => {
    const todoSchemeJoi = Joi.object({
        todo_title: Joi.string().required(),
        // isComplate: Joi.number().min(1).max(1).valid(1,2).required(),
    });
    const { error } = todoSchemeJoi.validate(todo);
    if (error) {
        throw new ClientError(error.details[0].message, 400);
    };
    return true;
};

export class todoValidation extends ValidationTodo {
    validation_create(todo: Todo): boolean | void { }
    validation_edit(todo: Todo): boolean | void { }
    constructor() {
        super()
        this.validation_create = (todo: Todo): boolean | void => {
            const todoCreateJoi = Joi.object({
                todo_title: Joi.string().required(),
                // isComplate: Joi.number().min(1).max(1).valid(1,2).required(),
            });
            const { error } = todoCreateJoi.validate(todo);
            if (error) {
                throw new ClientError(error.details[0].message, 400);
            };
            return true;
        }
        this.validation_edit = (todo: Todo): boolean | void => {
            const valSchema = Joi.object({
                todo_title: Joi.string().required(),
                // isComplate: Joi.number().min(1).max(1).valid(1, 2).required(),
            });
            const { error } = valSchema.validate(todo);
            if (error) {
                throw new ClientError(error.details[0].message, 400);
            };
            return true
        }
    }
}