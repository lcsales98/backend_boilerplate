import mongoose, { HookNextFunction } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type UserModelMethods = mongoose.Document & {
    comparePassword: Function;
    generateToken: Function;
};

export interface UserModel extends UserModelMethods {
    _id: string;
    full_name: string;
    email: string;
    password: string;
    deleted?: boolean;
}

const UserSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        deleted: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    {
        timestamps: true
    }
);

UserSchema.pre("save", async function(
    this: UserModel,
    next: HookNextFunction
): Promise<UserModel | any> {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 8);
});

UserSchema.methods.comparePassword = async function(password: string) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.statics.generateToken = (user: UserModel) => {
    const { password, ...safeUser } = user;
    return jwt.sign(safeUser, "BoraTempSecret");
};

export default mongoose.model<UserModel>("User", UserSchema);
