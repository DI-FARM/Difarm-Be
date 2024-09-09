import { Request, Response } from 'express';
import ResponseHandler from '../util/responseHandler';
import { StatusCodes } from 'http-status-codes';
import { TransactionEnum } from '../util/enum/StockTrans.enum';
import { PrismaClient, Roles } from '@prisma/client';
import stockTransactionService from "../service/stockTransaction.service";
import { paginate } from '../util/paginate';

const responseHandler = new ResponseHandler();

const prisma = new PrismaClient();

export const createTransaction = async (req: Request, res: Response) => {
  const { stockId, quantity, type } = req.body;
  // const { userId } = (req as any).user.data;

  try {
    // const userFarm = await prisma.farm.findFirst({
    //   where: { ownerId: userId },
    // });
    const userFarm = req.farm

    // if (!userFarm) {
    //   responseHandler.setError(StatusCodes.NOT_FOUND, 'Farm not found for the logged-in user.');
    //   return responseHandler.send(res);
    // }

    const stock = await prisma.stock.findUnique({ where: { id: stockId } });

    if (!stock) {
      responseHandler.setError(StatusCodes.NOT_FOUND, 'Stock not found.');
      return responseHandler.send(res);
    }

    const quantityFloat = parseFloat(quantity);
    if (isNaN(quantityFloat) || quantityFloat <= 0) {
      responseHandler.setError(StatusCodes.BAD_REQUEST, 'Quantity must be a positive number.');
      return responseHandler.send(res);
    }

    if (![TransactionEnum.ADDITION, TransactionEnum.CONSUME].includes(type)) {
      responseHandler.setError(StatusCodes.BAD_REQUEST, 'Invalid transaction type.');
      return responseHandler.send(res);
    }

    const updatedQuantity = type === TransactionEnum.ADDITION 
      ? stock.quantity + quantityFloat 
      : stock.quantity - quantityFloat;

    if (type === TransactionEnum.CONSUME && updatedQuantity < 0) {
      responseHandler.setError(StatusCodes.BAD_REQUEST, 'Insufficient stock quantity for this transaction.');
      return responseHandler.send(res);
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        stockId,
        quantity: quantityFloat,
        type,
        farmId: userFarm.id,
      },
    });

    await prisma.stock.update({
      where: { id: stockId },
      data: { quantity: updatedQuantity },
    });

    responseHandler.setSuccess(StatusCodes.CREATED, 'Transaction created successfully.', newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while creating the transaction.');
  }
  responseHandler.send(res);
};

export const getAllTransactions = async (req: Request, res: Response) => {
  const user = (req as any).user.data;
  const { farmId } = req.params;
  const { page = 1, pageSize = 10 } = req.query;
  const currentPage = Math.max(1, Number(page) || 1);
  const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100);

  const skip = (currentPage - 1) * currentPageSize;
  const take = currentPageSize;

  try {
    let stockTransactions;

    if (user.role === Roles.SUPERADMIN) {
      stockTransactions = await prisma.transaction.findMany({
        include: { farm: true ,stock:true},
        skip,
        take,
      });
    } else if (user.role === Roles.ADMIN) {
      stockTransactions = await prisma.transaction.findMany({
        where: { farmId },
        include: { farm: true ,stock:true},
        skip,
        take,
      });
    } else {
      responseHandler.setError(StatusCodes.FORBIDDEN, 'You do not have permission to view production records.');
      return responseHandler.send(res);
    }
    const totalCount = await prisma.transaction.count({
      where: user.role === Roles.ADMIN ? { farmId } : {},
    });

    const paginationResult = paginate(stockTransactions, totalCount, currentPage, currentPageSize);

    responseHandler.setSuccess(StatusCodes.OK, 'Transactions retrieved successfully.', paginationResult);
  } catch (error) {
    console.error(error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving transactions.');
  }
  responseHandler.send(res);
};

export const getTransactionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // const transaction = await prisma.transaction.findUnique({ where: { id } });
    const transaction = req.stockTransaction

    if (!transaction) {
      responseHandler.setError(StatusCodes.NOT_FOUND, 'Transaction not found.');
      return responseHandler.send(res);
    }

    responseHandler.setSuccess(StatusCodes.OK, 'Transaction retrieved successfully.', transaction);
  } catch (error) {
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving the transaction.');
  }
  responseHandler.send(res);
};

export const updateTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity, type } = req.body;

  try {
    const transaction = await prisma.transaction.findUnique({ where: { id } });

    if (!transaction) {
      responseHandler.setError(StatusCodes.NOT_FOUND, 'Transaction not found.');
      return responseHandler.send(res);
    }

    const stock = await prisma.stock.findUnique({ where: { id: transaction.stockId } });

    if (!stock) {
      responseHandler.setError(StatusCodes.NOT_FOUND, 'Stock not found.');
      return responseHandler.send(res);
    }

    const previousQuantity = transaction.quantity;
    const updatedQuantity = type === TransactionEnum.ADDITION
      ? stock.quantity + quantity - previousQuantity
      : stock.quantity - quantity + previousQuantity;

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: { quantity, type },
    });

    await prisma.stock.update({
      where: { id: transaction.stockId },
      data: { quantity: updatedQuantity },
    });

    responseHandler.setSuccess(StatusCodes.OK, 'Transaction updated successfully.', updatedTransaction);
  } catch (error) {
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while updating the transaction.');
  }
  responseHandler.send(res);
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const transaction = await prisma.transaction.findUnique({ where: { id } });

    if (!transaction) {
      responseHandler.setError(StatusCodes.NOT_FOUND, 'Transaction not found.');
      return responseHandler.send(res);
    }

    const stock = await prisma.stock.findUnique({ where: { id: transaction.stockId } });

    if (!stock) {
      responseHandler.setError(StatusCodes.NOT_FOUND, 'Stock not found.');
      return responseHandler.send(res);
    }

    const updatedQuantity = transaction.type === TransactionEnum.ADDITION
      ? stock.quantity - transaction.quantity
      : stock.quantity + transaction.quantity;

    await prisma.stock.update({
      where: { id: transaction.stockId },
      data: { quantity: updatedQuantity },
    });

    await prisma.transaction.delete({ where: { id } });

    responseHandler.setSuccess(StatusCodes.OK, 'Transaction deleted successfully.', { data: null });
  } catch (error) {
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while deleting the transaction.');
  }
  responseHandler.send(res);
};
