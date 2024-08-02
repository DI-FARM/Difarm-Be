import productionTotalsService from "../service/productionTotals.service";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ResponseHandler from "../util/responseHandler";

const responseHandler = new ResponseHandler();

const AllFarmProdTotals = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { farmId } = req.params;
  const data = await productionTotalsService.getFarmProductionTotalAmounts(
    farmId
  );
  responseHandler.setSuccess(
    StatusCodes.OK,
    "production totals retrieved successfully",
    data
  );
  return responseHandler.send(res);
};

const newProductInfo = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { farmId } = req.params;
  const body = {
    ...req.body,
    farmId,
  };
  const data = await productionTotalsService.createProductInfo(body);
  responseHandler.setSuccess(
    StatusCodes.OK,
    "product information added successfully",
    data
  );
  return responseHandler.send(res);
};
const editProductInfo = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { infoId } = req.params;
  const data = await productionTotalsService.updateProductInfo(
    infoId,
    req.body
  );
  responseHandler.setSuccess(
    StatusCodes.OK,
    "product information updated successfully",
    data
  );
  return responseHandler.send(res);
};
const removeProductInfo = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { infoId } = req.params;
  const data = await productionTotalsService.deleteProductInfo(infoId);
  responseHandler.setSuccess(
    StatusCodes.OK,
    "product information deleted successfully",
    data
  );
  return responseHandler.send(res);
};
const getSingleProductInfo = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const data = req.productInfo
  responseHandler.setSuccess(
    StatusCodes.OK,
    "product information retrieved successfully",
    data
  );
  return responseHandler.send(res);
};

export default {
  AllFarmProdTotals,
  newProductInfo,
  editProductInfo,
  removeProductInfo,
  getSingleProductInfo,
};
