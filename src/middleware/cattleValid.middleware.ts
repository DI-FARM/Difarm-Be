import { NextFunction, Request, Response } from "express";
import cattleValidation from "../validation/cattle.validation";

const cattlesValidation = (req: Request, res:Response, next: NextFunction) => {
    const { error } = cattleValidation(req.body);
    if (error) {
        res.status(400).json({
            status: 400,
            error: error.details.map((detail) => detail.message.replace(/[^a-zA-Z0-9 ]/g, '')),
        });
    } else {
        next();
    }
};

export default cattlesValidation;
