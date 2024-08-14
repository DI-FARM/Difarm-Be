import { NextFunction,Request,Response } from "express";
import wasteLogsService from "../service/wasteLogs.service";
import ResponseHandler from "../util/responseHandler";
import { StatusCodes } from "http-status-codes";

const responseHandler = new ResponseHandler();

const checkWasteLogExists = async(req:Request,res:Response,next:NextFunction)=>{
    const { wasteId } = req.params;
    const data = await wasteLogsService.getWasteLogById(wasteId)

    if (!data) {
        responseHandler.setError(
          StatusCodes.NOT_FOUND,
          "waste-log with this id not found"
        );
        return responseHandler.send(res);
      }
      req.wasteLog = data;

      next();

}

export default {checkWasteLogExists}