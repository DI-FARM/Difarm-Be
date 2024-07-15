import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { hashPassword } from "../service/bcrypt.service";
import passportLocal from "../config/passportLocal";
import ResponseHandler from "../util/responseHandler";
import prisma from "../db/prisma";
import { sendEmail } from "../service/sendEmail.service";
import { generateEmailVerificationToken, verifyToken } from "../service/token.service";
import { UserI } from "../interface/user.interface";

const responseHandler = new ResponseHandler();

export const registerUser = async (req: Request, res: Response) => {
    try {
        const {
            fullname, username, email, gender, phone, password
        } = req.body;

        const emailExist = await prisma.account.findUnique({ where: { email } });
        const accountExist = await prisma.account.findUnique({ where: { username } });

        if (emailExist) {
            responseHandler.setError(StatusCodes.BAD_REQUEST, "An account with this email address already exists.");
            return responseHandler.send(res);
        }

        if (username && accountExist) {
            responseHandler.setError(StatusCodes.BAD_REQUEST, "An account with this  username already exists.");
            return responseHandler.send(res);
        }

        const userAccount = await prisma.account.create({
            data: {
                username,
                email,
                phone,
                password: await hashPassword(password)
            }
        });

        const userData = {
            accountId: userAccount.id,
            fullname,
            gender
        };
        const user = await prisma.user.create({ data: userData });

        const verificationToken = generateEmailVerificationToken({ userId: user.id });

        const verificationUrl = `http://yourdomain.com/verify-email?token=${verificationToken}`;

        const emailMessage = `Please verify your email by clicking the following link: ${verificationUrl}`;

        await sendEmail(email, 'Email Verification', emailMessage);


        responseHandler.setSuccess(StatusCodes.CREATED, "Registration successful. Please check your email to verify your account.", user);
        return responseHandler.send(res);

    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: ReasonPhrases.INTERNAL_SERVER_ERROR, error: 'Server error' });
    }
};

export const emailVerification = async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid verification link.' });
    }

    try {
        const decoded = verifyToken(token as string, "verify-email");

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        const account = await prisma.account.findUnique({ where: { id: user?.accountId } });

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid verification link.' });
        }
        if (!account) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid verification link.' });
        }

        await prisma.account.update({
            where: { id: account.id },
            data: { status: true }
        });

        res.status(StatusCodes.OK).json({ message: 'Email verified successfully.' });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired verification link.' });
    }
}

export const userLogin = (req: Request, res: Response, next: NextFunction) => {
    passportLocal.authenticate('local', (err: any, user: UserI) => {

        if (err) {
            return next(err);
        }
        if (!user) {
            responseHandler.setError(StatusCodes.BAD_REQUEST, 'Invalid email or password');
            return responseHandler.send(res);
        }
        try {
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(StatusCodes.OK).json({
                    message: 'Login successful',
                    user
                });
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: ReasonPhrases.INTERNAL_SERVER_ERROR, error: 'Server error' });
        }
    })(req, res, next);

};

export const userLogout = (req: Request, res: Response) => {

    req.logout(() => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: ReasonPhrases.INTERNAL_SERVER_ERROR, error: 'Server error' });
            }
        });
        return res.status(StatusCodes.OK).json({
            message: 'Logout successful',
        })
    })
}


export const userAccessToken = (req: Request, res: Response) => {
    responseHandler.setSuccess(
        StatusCodes.OK,
        "User login is successfully",
        req.user
    );
    return responseHandler.send(res);
};

export const checkAuth = (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.status(StatusCodes.OK).json({ isAuthenticated: true, user: req.user });
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({ isAuthenticated: false });
    }
};