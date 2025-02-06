"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTodo = exports.readFile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const config_1 = require("../config");
const { dbFilePath } = config_1.ServerConfiguration;
const readFile = async (fileName) => {
    let read = await promises_1.default.readFile(dbFilePath(fileName), "utf-8");
    return read ? JSON.parse(read) : [];
};
exports.readFile = readFile;
const readTodo = async (fileName) => {
    let read = await promises_1.default.readFile(dbFilePath(fileName), "utf-8");
    return read ? JSON.parse(read) : [];
};
exports.readTodo = readTodo;
