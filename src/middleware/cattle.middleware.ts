import { NextFunction, Request, Response } from "express";
import { Roles } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import cattleValidation from "../validation/cattle.validation";
import cattleService from "../service/cattle.service";
import ResponseHandler from "../util/responseHandler";
import AuthorizedOnProperty from "./checkOwner.middleware";

const responseHandler = new ResponseHandler();

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

const checkUserCattleExists = async(req:Request, res:Response,next:NextFunction)=>{
    const {cattleId} = req.params;
    const user = (req as any).user.data;
    const cattle = await cattleService.getSingleCattle(cattleId)
    if (!cattle) {
      responseHandler.setError(
        StatusCodes.NOT_FOUND,
        "Cattle with this id not found"
      );
      return responseHandler.send(res);
    }
  
    if (!AuthorizedOnProperty(cattle, user) && user.role !== Roles.SUPERADMIN) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You do not have access to this cattle",
      });
    }
    req.cattle = cattle;
    next()
  
  }

export default {cattlesValidation, checkUserCattleExists};
