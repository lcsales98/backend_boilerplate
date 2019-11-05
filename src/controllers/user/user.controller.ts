import User, { UserModel } from "../../models/Users.model";
import { Response, Request, NextFunction } from "express";
import * as responses from "../../utils/responses.util";

interface RequestWithUser extends Request {
    user?: UserModel;
}

class UserController {
    async index(
        req: Request,
        res: Response
    ): Promise<Response | undefined | void> {
        try {
            const finded_users = await User.find({});

            if (finded_users.length > 0) {
                return responses.sendSuccess(res, finded_users);
            }
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

    async create(req: Request, res: Response): Promise<Response | undefined> {
        const { password, password_conf } = req.body;
        const user: UserModel = new User(req.body);
        user.deleted = false;

        if (password !== password_conf) {
            return responses.sendError(
                res,
                400,
                "Sua senha e a confimação não são iguais",
                "auth/invalid-password"
            );
        }

        try {
            const exist_user = await User.findOne({ email: user.email });

            if (exist_user) {
                return responses.sendError(
                    res,
                    400,
                    "this e-mail already registered",
                    "user/already-registered"
                );
            }
            const saved_user = await user.save();

            return responses.sendSuccess(res, saved_user);
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

    async show(
        req: Request,
        res: Response
    ): Promise<Response | undefined | void> {
        try {
            const user = await User.findById({ _id: req.params.userId });
            if (!user) {
                return responses.sendError(
                    res,
                    400,
                    "this user not exists",
                    "user/not-exists"
                );
            }
            await responses.sendSuccess(res, user);
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

    async update(
        req: RequestWithUser,
        res: Response
    ): Promise<Response | undefined | void> {
        if (req.user === undefined) {
            return responses.sendError(
                res,
                400,
                "this user not exists",
                "user/not-exists"
            );
        }

        try {
            const body_user = req.body;
            const db_user = req.user;
            const updated_user: any = {};

            body_user.frist_name !== undefined
                ? (updated_user.frist_name = body_user.frist_name)
                : undefined;
            body_user.last_name !== undefined
                ? (updated_user.last_name = req.body.last_name)
                : undefined;
            body_user.full_name !== undefined
                ? (updated_user.full_name = req.body.full_name)
                : undefined;
            body_user.cpf !== undefined
                ? (updated_user.cpf = req.body.cpf)
                : undefined;
            body_user.email !== undefined
                ? (updated_user.email = req.body.email)
                : undefined;
            body_user.password !== undefined
                ? (updated_user.password = req.body.password)
                : undefined;

            console.log(updated_user);
            if (updated_user === null) {
                return responses.sendError(
                    res,
                    500,
                    "internal server error",
                    "server/error"
                );
            }

            const updated_doc = await User.findByIdAndUpdate(
                { _id: db_user._id },
                updated_user,
                (err, res) => res
            );

            return responses.sendSuccess(res, updated_doc);
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

    async destroy(
        req: RequestWithUser,
        res: Response
    ): Promise<Response | undefined | void> {
        if (req.user !== undefined) {
            if (req.user.deleted) {
                return responses.sendError(
                    res,
                    400,
                    "this user has been deleted",
                    "user/has-been_deleted"
                );
            }

            try {
                const user_id = req.user._id;

                const deleted_doc = await User.findByIdAndUpdate(
                    { _id: user_id },
                    { deleted: true },
                    (err, res) => res
                );

                return responses.sendSuccess(res, deleted_doc);
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



    async middlewareIncludeUserInRequest(
        req: RequestWithUser,
        res: Response,
        next: NextFunction
    ): Promise<Response | undefined | void> {
        const user_id = req.params.userId;

        try {
            const finded_doc = await User.findById(user_id);
            if (finded_doc) {
                req.user = finded_doc;
            } else {
                return responses.sendError(
                    res,
                    400,
                    "this user not exists",
                    "user/not-exists"
                );
            }
            return next();
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

export default new UserController();
