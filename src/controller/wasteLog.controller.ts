import { NextFunction, Request, Response } from "express";
import { WasteLogType } from "../service/wasteLogs.service";
import wasteLogsService from "../service/wasteLogs.service";
import ResponseHandler from "../util/responseHandler";
import { StatusCodes } from "http-status-codes";

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
  const updatedLogResult = await wasteLogsService.changeWasteLog(
    req.body,
    wasteId
  );
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
