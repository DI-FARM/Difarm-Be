import dotenv from 'dotenv';
import Jwt from "jsonwebtoken";
import prisma from '../db/prisma';
import { AccountI } from '../interface/account.interface';

dotenv.config();

interface EmailVerifyI {
    userId: String
}

const expiryTime = Number(process.env.EXPIRE_TIME);
if (isNaN(expiryTime)) {
    throw new Error('EXPIRE_TIME must be a valid number in seconds');
}

const generateToken = (data: any) => {
    const token = Jwt.sign({ data }, process.env.JWT_SECRET as string, {
        expiresIn: expiryTime,
    });
    return token;
};

const generateEmailVerificationToken = (data: EmailVerifyI) => {
    const token = Jwt.sign({ data }, process.env.JWT_VERIF_SECRET as string, {
        expiresIn: expiryTime,
    });
    return token;
};
const generateForgotPasswordToken = (data: {email: string, id: string}) => {
    const token = Jwt.sign({ data }, process.env.JWT_SECRET as string);
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
export { generateToken, generateEmailVerificationToken, verifyToken, generateForgotPasswordToken };
