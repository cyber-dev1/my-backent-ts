"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTodo = exports.writeFile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const config_1 = require("../config");
const { dbFilePath } = config_1.ServerConfiguration;
const writeFile = async (fileName, user) => {
    await promises_1.default.writeFile(dbFilePath(fileName), JSON.stringify(user, null, 4));
    return true;
};
exports.writeFile = writeFile;
const writeTodo = async (fileName, todo) => {
    await promises_1.default.writeFile(dbFilePath(fileName), JSON.stringify(todo, null, 4));
    return true;
};
exports.writeTodo = writeTodo;
