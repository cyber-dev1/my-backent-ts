"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
const errors_1 = require("../utils/errors");
const jwt_1 = require("../lib/jwt/jwt");
const readFile_1 = require("./readFile");
const checkToken = async (req, res) => {
    try {
        let token = req.headers.token;
        if (!token)
            throw new errors_1.ClientError("Unauthorized", 401);
        let verifyToken = jwt_1.tokenService.verifyToken(token);
        let users = await (0, readFile_1.readFile)("users.json");
        if (!(users.some((user) => user.user_id == verifyToken.user_id)))
            throw new errors_1.ClientError("token is Invalid !", 401);
        if (!(verifyToken.userAgent == req.headers["user-agent"]))
            throw new errors_1.ClientError("token is Invalid", 401);
        return true;
    }
    catch (error) {
        let err = {
            message: error.message,
            status: error.status,
        };
        (0, errors_1.GlobalError)(res, err);
    }
};
exports.checkToken = checkToken;
