/**
 * IMPORT DEPENDECIES
 */

import express, { Express } from "express";
import mongoose from "mongoose";
// import validate from "express-validator";

/**
 * IMPORT ROUTES
 */
import UserRoutes from "../routes/users.routes";

interface App {
    express: Express;
    isDev: Boolean;
}

class App {
    constructor() {
        this.express = express();
        this.isDev = process.env.NODE_ENV !== "production";
        this.database();
        this.middlewares();
        this.routes();
    }

    database() {
        mongoose.connect("mongodb://localhost:27017/backend_mongodb", {
            useCreateIndex: true,
            useNewUrlParser: true
        });
    }

    middlewares() {
        this.express.use(express.json());
    }

    routes() {
        this.express.use(UserRoutes);
    }
}

export default new App().express;
