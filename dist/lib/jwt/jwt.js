"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
exports.tokenService = {
    createToken: (payload) => (0, jsonwebtoken_1.sign)(payload, process.env.TOKEN_KEY, { expiresIn: "7d" }),
    verifyToken: (token) => (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_KEY)
};
