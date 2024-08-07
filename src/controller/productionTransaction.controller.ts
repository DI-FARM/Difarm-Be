import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ResponseHandler from "../util/responseHandler";
import productionTransactionService from "../service/productionTransaction.service";
import { ProdTransactionBody } from "../interface/prodTransaction.interface";
import productionTotalsService from "../service/productionTotals.service";

const responseHandler = new ResponseHandler();

const addTransaction = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { farmId } = req.params;
  const { quantity, productType } = req.body;
  const amountValue = quantity * req.productInfo?.pricePerUnit!;
  const body: ProdTransactionBody = {
    ...req.body,
    farmId,
    value: amountValue,
    total: req.productInfo?.totalQuantity,
  };
  const data = await productionTransactionService.recordTransaction(body);
  responseHandler.setSuccess(
    StatusCodes.CREATED,
    "transaction recorded successfully",
    data
  );
  return responseHandler.send(res);
};

const allTransactions = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { farmId } = req.params;
  const data = await productionTransactionService.getAllTransactions(farmId);
  responseHandler.setSuccess(
    StatusCodes.OK,
    "transactions retrieved successfully",
    data
  );
  return responseHandler.send(res);
};
const singleTransactions = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const data = req.transaction // this is set by the middleware on the route
  responseHandler.setSuccess(
    StatusCodes.OK,
    "transaction retrieved successfully",
    data
  );
  return responseHandler.send(res);
};

const updateTransactions = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { transactionId } = req.params;
  const data = await productionTransactionService.updateTransactions(
    transactionId,
    req.body
  );
  responseHandler.setSuccess(
    StatusCodes.OK,
    "transaction updated successfully",
    data
  );
  return responseHandler.send(res);
};
const removeTransactions = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { transactionId } = req.params;
  const data = await productionTransactionService.deleteTransactions(
    transactionId
  );
  responseHandler.setSuccess(
    StatusCodes.OK,
    "transaction removed successfully",
    data
  );
  return responseHandler.send(res);
};

export default {
  addTransaction,
  allTransactions,
  singleTransactions,
  updateTransactions,
  removeTransactions,
};
