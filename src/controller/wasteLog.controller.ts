import { NextFunction, Request, Response } from "express";
import { WasteLogType } from "../service/wasteLogs.service";
import wasteLogsService from "../service/wasteLogs.service";
import ResponseHandler from "../util/responseHandler";
import { StatusCodes } from "http-status-codes";
import productionTotalsService from "../service/productionTotals.service";
import { Roles } from "@prisma/client";
import prisma from "../db/prisma";
import { paginate } from "../util/paginate";

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

export const allWasteLogs = async (req: Request, res: Response, _next: NextFunction) => {
  const responseHandler = new ResponseHandler();
  const { farmId } = req.params;
  const { page = 1, pageSize = 10 } = req.query;
  const currentPage = Math.max(1, Number(page) || 1); // Ensure page is at least 1
  const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100); // Ensure pageSize is between 1 and 100
  const skip = (currentPage - 1) * currentPageSize;
  const take = currentPageSize;
  const user = (req as any).user.data;
  try {
    let wasteLogs;

    if (user.role === Roles.SUPERADMIN) {
      wasteLogs = await prisma.wastesLog.findMany({
        include: { farm: true },
        skip,
        take,
      });
    } else if (user.role === Roles.ADMIN) {
      wasteLogs = await prisma.wastesLog.findMany({
        where: { farmId },
        include: { farm: true },
        skip,
        take,
      });
    } else {
      responseHandler.setError(StatusCodes.FORBIDDEN, 'You do not have permission to view production records.');
      return responseHandler.send(res);
    }
    const totalCount = await prisma.wastesLog.count({
      where: user.role === Roles.ADMIN ? { farmId } : {},
    });

    const paginationResult = paginate(wasteLogs, totalCount, currentPage, currentPageSize);

    responseHandler.setSuccess(StatusCodes.OK, "All waste-logs retrieved successfully", paginationResult);
  } catch (error) {
    console.error('Error retrieving waste logs:', error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving waste logs');
  }

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
