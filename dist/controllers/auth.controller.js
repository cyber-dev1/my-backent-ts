"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readFile_1 = require("../models/readFile");
const writeFile_1 = require("../models/writeFile");
const errors_1 = require("../utils/errors");
const validators_1 = require("../utils/validators");
const controller_dto_1 = require("./controller.dto");
const jwt_1 = require("../lib/jwt/jwt");
const { createToken, verifyToken } = jwt_1.tokenService;
class AuthController extends controller_dto_1.Auth {
    register(req, res) { }
    ;
    login(req, res) { }
    ;
    constructor() {
        super();
        this.register = async (req, res) => {
            try {
                let newUser = '';
                req.on("data", (chunk) => {
                    newUser += chunk;
                });
                req.on("end", async () => {
                    try {
                        let user = JSON.parse(newUser);
                        const validator = (0, validators_1.registerValidator)(user);
                        if (validator) {
                            let users = await (0, readFile_1.readFile)("users.json");
                            if (users.some((client) => client.email == user.email))
                                throw new errors_1.ClientError("It's user already exists", 400);
                            user = { id: users.length ? users.at(-1).id + 1 : 1, ...user };
                            users.push(user);
                            let writeUser = await (0, writeFile_1.writeFile)("users.json", users);
                            res.writeHead(201, { "content-type": "application/json" });
                            if (writeUser)
                                return res.end(JSON.stringify({ message: "User successfully registered !", status: 201, accessToken: createToken({ user_id: user.id, userAgent: req.headers["user-agent"] }) }));
                            else
                                throw new errors_1.ServerError("user not saved yet !");
                        }
                        ;
                    }
                    catch (error) {
                        let err = {
                            message: error.message,
                            status: error.status,
                        };
                        (0, errors_1.GlobalError)(res, err);
                    }
                });
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status,
                };
                (0, errors_1.GlobalError)(res, err);
            }
        };
        this.login = async (req, res) => {
            try {
                let user = '';
                req.on("data", (chunk) => {
                    user += chunk;
                });
                req.on("end", async () => {
                    try {
                        user = JSON.parse(user);
                        let validator = (0, validators_1.loginValidator)(user);
                        if (validator) {
                            let users = await (0, readFile_1.readFile)("users.json");
                            let findUser = users.find((client) => client.email == user.email);
                            if (!findUser)
                                throw new errors_1.ClientError("User not found !", 404);
                            if (findUser?.password == user.password)
                                return res.end(JSON.stringify({ message: "User successfully Logined !", status: 200, accessToken: createToken({ user_id: findUser.user_id, userAgent: req.headers["user-agent"] }) }));
                            else
                                throw new errors_1.ClientError("User not found !", 404);
                        }
                    }
                    catch (error) {
                        let err = {
                            message: error.message,
                            status: error.status,
                        };
                        (0, errors_1.GlobalError)(res, err);
                    }
                });
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status,
                };
                (0, errors_1.GlobalError)(res, err);
            }
        };
    }
}
;
exports.default = new AuthController();
