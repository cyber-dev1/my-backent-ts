"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoValidation = exports.todoValidator = exports.loginValidator = exports.registerValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const controller_dto_1 = require("../controllers/controller.dto");
const errors_1 = require("./errors");
const registerValidator = (user) => {
    const userSchema = joi_1.default.object({
        first_name: joi_1.default.string().required(),
        last_name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().pattern(/^(?=[A-Za-z0-9]{4,10}$)[A-Za-z0-9]+$/).required(),
    });
    const { error } = userSchema.validate(user);
    if (error) {
        throw new errors_1.ClientError(error.details[0].message, 400);
    }
    return true;
};
exports.registerValidator = registerValidator;
const loginValidator = (user) => {
    const userLoginSchema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().pattern(/^(?=[A-Za-z0-9]{4,10}$)[A-Za-z0-9]+$/).required(),
    });
    const { error } = userLoginSchema.validate(user);
    if (error) {
        throw new errors_1.ClientError(error.details[0].message, 400);
    }
    return true;
};
exports.loginValidator = loginValidator;
const todoValidator = (todo) => {
    const todoSchemeJoi = joi_1.default.object({
        todo_title: joi_1.default.string().required(),
        // isComplate: Joi.number().min(1).max(1).valid(1,2).required(),
    });
    const { error } = todoSchemeJoi.validate(todo);
    if (error) {
        throw new errors_1.ClientError(error.details[0].message, 400);
    }
    ;
    return true;
};
exports.todoValidator = todoValidator;
class todoValidation extends controller_dto_1.ValidationTodo {
    validation_create(todo) { }
    validation_edit(todo) { }
    constructor() {
        super();
        this.validation_create = (todo) => {
            const todoCreateJoi = joi_1.default.object({
                todo_title: joi_1.default.string().required(),
                // isComplate: Joi.number().min(1).max(1).valid(1,2).required(),
            });
            const { error } = todoCreateJoi.validate(todo);
            if (error) {
                throw new errors_1.ClientError(error.details[0].message, 400);
            }
            ;
            return true;
        };
        this.validation_edit = (todo) => {
            const valSchema = joi_1.default.object({
                todo_title: joi_1.default.string().required(),
                // isComplate: Joi.number().min(1).max(1).valid(1, 2).required(),
            });
            const { error } = valSchema.validate(todo);
            if (error) {
                throw new errors_1.ClientError(error.details[0].message, 400);
            }
            ;
            return true;
        };
    }
}
exports.todoValidation = todoValidation;
