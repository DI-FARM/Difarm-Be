import { NextFunction, Request, Response } from "express";
import { Roles } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import stockTransValidation from "../validation/stockTrans.validation";
import ResponseHandler from "../util/responseHandler";
import AuthorizedOnProperty from "./checkOwner.middleware";
// import stockTransactionService from "../service/stockTransaction.service";

const responseHandler = new ResponseHandler();

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

// const checkStockTransactionExists = async(req:Request, res:Response,next:NextFunction)=>{
  //   const {id} = req.params;
  //   const user = (req as any).user.data;
  //   const stockTransaction = await stockTransactionService.signleStocktransaction(id)
  //   if (!stockTransaction) {
  //     responseHandler.setError(
  //       StatusCodes.NOT_FOUND,
  //       "Stock transaction with this id not found"
  //     );
  //     return responseHandler.send(res);
  //   }

  //   if (!AuthorizedOnProperty(stockTransaction, user) && (user.role !== Roles.SUPERADMIN)) {
  //     return res.status(StatusCodes.FORBIDDEN).json({
  //       message: "You do not have access to this stock transaction"
  //     });
  //   }
  //   req.stockTransaction = stockTransaction;
  //   next()
  
  // }
export default {validationMiddleware}
