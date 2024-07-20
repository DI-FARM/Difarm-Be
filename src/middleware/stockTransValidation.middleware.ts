import { NextFunction, Request, Response } from "express";
import stockTransValidation from "../validation/stockTrans.validation";

const validationMiddleware = (req: Request, res:Response, next: NextFunction) => {
    const { error } = stockTransValidation(req.body);
    if (error) {
        res.status(400).json({
            status: 400,
            error: error.details.map((detail) => detail.message.replace(/[^a-zA-Z0-9 ]/g, '')),
        });
    } else {
        next();
    }
};

export default validationMiddleware;
