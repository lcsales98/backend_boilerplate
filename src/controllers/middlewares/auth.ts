import * as responses from "../../utils/responses.util";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { Request, Response, NextFunction } from "express";

interface RequestUser extends Request {
    user?: object;
}

export default async function(
    req: RequestUser,
    res: Response,
    next: NextFunction
) {
    console.log("auth");
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return responses.sendError(
            res,
            400,
            "token not provider",
            "user/token-not-provider"
        );
    }

    const token = authHeader.split(" ");
    try {
        const decoded: any = await promisify(jwt.verify)(
            token[1],
            "BoraTempSecret"
        );
        console.log("decoded", decoded._doc);
        req.user = decoded._doc;
        return next();
    } catch (err) {
        console.log("error", err);
        return responses.sendError(
            res,
            500,
            "internal server error",
            "server/internal-error"
        );
    }
}
