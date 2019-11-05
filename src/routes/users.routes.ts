import express from "express";
import UserController from "../controllers/user/user.controller";
import UserAuthController from "../controllers/user/userAuth.controller";
import authMiddleware from "../controllers/middlewares/auth";

const Router = express.Router();
/**
    Session Routes
*/
Router.route("/api/users/signin").post(UserAuthController.signIn);

/**
 User Routes
 */
Router.route("/api/user/me")
    .all(authMiddleware)
    .get(UserAuthController.me);

Router.route("/api/users")
    .post(UserController.create)
    .all(authMiddleware)
    .get(UserController.index);

Router.route("/api/users/userId/:userId/user")
    .all(authMiddleware)
    .get(UserController.show)
    .put(UserController.update)
    .delete(UserController.destroy);

export default Router;
