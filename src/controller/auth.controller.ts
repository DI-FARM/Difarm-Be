import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { hashPassword } from "../service/bcrypt.service";
import passportLocal from "../config/passportLocal";
import ResponseHandler from "../util/responseHandler";
import prisma from "../db/prisma";
import { sendEmail } from "../service/sendEmail.service";
import { generateEmailVerificationToken, generateForgotPasswordToken, verifyToken } from "../service/token.service";
import { UserI } from "../interface/user.interface";
import userService from "../service/user.service";
import templateMails from "../util/templateMails";

const responseHandler = new ResponseHandler();

export const registerUser = async (req: Request, res: Response) => {
    try {
        const {
            fullname, username, email, gender, phone, password
        } = req.body;

        const emailExist = await prisma.account.findUnique({ where: { email } });
        const phoneExist = await prisma.account.findUnique({ where: { phone } });
        const accountExist = await prisma.account.findUnique({ where: { username } });

        if (emailExist) {
            responseHandler.setError(StatusCodes.BAD_REQUEST, "An account with this email address already exists.");
            return responseHandler.send(res);
        }

        if (phoneExist) {
            responseHandler.setError(StatusCodes.BAD_REQUEST, "An account with this phone address already exists.");
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
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                account: true,
            },
        });

        responseHandler.setSuccess(StatusCodes.OK, "Users retrieved successfully", users);
        return responseHandler.send(res);
    } catch (error) {
        console.error('Error retrieving users:', error);
        responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, "Error retrieving users");
        return responseHandler.send(res);
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

export const forgotPassword = async(req: Request, res: Response) => {
const {email}= req.body
const user = await userService.getUserByEmail(email)
if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: 'User with email does not exist!',
    });
  }
const userMeta = {
    email,
    id: user.id
}
const verifToken = generateForgotPasswordToken(userMeta);
const emailBody = templateMails.ForgortPasswordTemplate(verifToken);
await sendEmail(email, "Reset password link", emailBody);
return res
  .status(StatusCodes.OK)
  .json({ message: `we have sent password reset link to your email ${email}` });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) {
    return res.status(StatusCodes.NOT_FOUND).json({
        message: "No token provided",
      });
  }
  const payload = verifyToken(token, "reset-pass");
  const { email } = payload.data;
  const hashedPassword: string = await hashPassword(req.body.newPassword)
  await userService.resetPassword(email,hashedPassword);
  res.status(StatusCodes.OK).json({
    message: "You have reset successful your password",
  });
};
