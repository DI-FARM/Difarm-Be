import { NextFunction, Request, Response } from "express";
import { WasteLogType } from "../service/wasteLogs.service";
import wasteLogsService from "../service/wasteLogs.service";
import ResponseHandler from "../util/responseHandler";
import { StatusCodes } from "http-status-codes";
import productionTotalsService from "../service/productionTotals.service";

const responseHandler = new ResponseHandler();

const createWasteLog = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { type, quantity, date } = req.body;
  const {farmId} = req.params
  const farmWasteData: WasteLogType = { type, quantity, date, farmId };

  const newLogResult = await wasteLogsService.addWasteLog(farmWasteData);
  await productionTotalsService.recordAmount( // update the totals
    farmId,
    type,
    quantity
);
  responseHandler.setSuccess(
    StatusCodes.CREATED,
    "Waste-log created successfull",
    newLogResult
  );
  return responseHandler.send(res);
};

const allWasteLogs = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { farmId } = req.params;
  const updatedLogResult = await wasteLogsService.getAllWasteLogs(farmId);
  responseHandler.setSuccess(
    StatusCodes.CREATED,
    "All waste-logs retrieved successfull",
    updatedLogResult
  );
  return responseHandler.send(res);
};

const singleWasteLog = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { wasteId } = req.params;
  const updatedLogResult = await wasteLogsService.getWasteLogById(wasteId);
  responseHandler.setSuccess(
    StatusCodes.CREATED,
    "waste-log retrieved successfull",
    updatedLogResult
  );
  return responseHandler.send(res);
};

const updateWasteLog = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { wasteId } = req.params;
  const {quantity} = req.body
  const {farmId, quantity: previousQuantity, type} = req.wasteLog

  const updatedLogResult = await wasteLogsService.changeWasteLog(
    req.body,
    wasteId
  );
  if (quantity) {
    if (previousQuantity > quantity) {
        const updatedQuantity = previousQuantity - quantity
        await productionTotalsService.recordAmount(farmId,type ,-updatedQuantity)
    }
    else{
        const updatedQuantity = quantity - previousQuantity
        await productionTotalsService.recordAmount(farmId,type,updatedQuantity)
    }
  }
  responseHandler.setSuccess(
    StatusCodes.CREATED,
    "Waste-log updated successfull",
    updatedLogResult
  );
  return responseHandler.send(res);
};

const deleteWasteLog = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { wasteId } = req.params;
  const deleteLogResult = await wasteLogsService.removeWasteLogById(wasteId);
  responseHandler.setSuccess(
    StatusCodes.CREATED,
    "Waste-log deleted successfull",
    deleteLogResult
  );
  return responseHandler.send(res);
};

export default {
  createWasteLog,
  updateWasteLog,
  deleteWasteLog,
  allWasteLogs,
  singleWasteLog,
};
