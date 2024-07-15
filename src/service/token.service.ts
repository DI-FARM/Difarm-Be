import dotenv from 'dotenv';
import Jwt from "jsonwebtoken";
import prisma from '../db/prisma';
import { AccountI } from '../interface/account.interface';

dotenv.config();

interface EmailVerifyI {
    userId: String
}

const generateToken = (data: AccountI) => {
    const token = Jwt.sign({ data }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.EXPIRE_TIME,
    });
    return token;
};

const generateEmailVerificationToken = (data: EmailVerifyI) => {
    const token = Jwt.sign({ data }, process.env.JWT_VERIF_SECRET as string, {
        expiresIn: process.env.EXPIRE_VERIF_TIME,
    });
    return token;
};

const verifyToken = (token: string, type: string): any => {
    if (type === "verify-email") {
        return Jwt.verify(token, process.env.JWT_VERIF_SECRET as string, (err, decoded) => {
            if (err) {
                return err;
            }
            return decoded;
        });
    }

    return Jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            return err;
        }
        return decoded;
    });
};
export { generateToken, generateEmailVerificationToken, verifyToken };
