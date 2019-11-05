import User, { UserModel } from "../../models/Users.model";
import { Request, Response } from "express";
import * as responses from "../../utils/responses.util";

interface RequestWithUser extends Request {
    user?: UserModel;
}

class UserAuth {
    async signIn(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const user: UserModel | null = await User.findOne({ email: email });

            if (!user) {
                return responses.sendError(
                    res,
                    400,
                    "User not found",
                    "user/not-found"
                );
            }

            if (!(await user.comparePassword(password))) {
                return responses.sendError(
                    res,
                    400,
                    "Invalid password",
                    "user/invalid-password"
                );
            }

            if (user.deleted) {
                return responses.sendError(
                    res,
                    400,
                    "This user was deleted",
                    "user/was-deleted"
                );
            }

            console.log("teste");

            const userJWT = User.schema.statics.generateToken(user);
            return responses.sendSuccess(res, { user, token: userJWT });
        } catch (error) {
            return responses.sendError(
                res,
                500,
                "internal server error",
                "server/internal-error"
            );
        }
    }

    async me(
        req: RequestWithUser,
        res: Response
    ): Promise<Response | undefined | void> {
        try {
            if (!req.user) {
                return responses.sendError(
                    res,
                    400,
                    "this user not exists",
                    "user/not-exists"
                );
            }
            return responses.sendSuccess(res, req.user);
        } catch (error) {
            console.log(error);
            if (error.status) {
                return responses.sendError(
                    res,
                    error.status,
                    "internal server error",
                    "internal-server-error"
                );
            } else {
                return responses.sendError(
                    res,
                    500,
                    "internal server error",
                    "internal-server-error"
                );
            }
        }
    }
}

export default new UserAuth();
