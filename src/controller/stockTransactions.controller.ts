import { Request, Response } from 'express';
import ResponseHandler from '../util/responseHandler';
import { StatusCodes } from 'http-status-codes';
import { TransactionEnum } from '../util/enum/StockTrans.enum';
import { PrismaClient } from '@prisma/client';

const responseHandler = new ResponseHandler();

const prisma = new PrismaClient();

export const createTransaction = async (req: Request, res: Response) => {
  const { stockId, quantity, type } = req.body;
  const { userId } = (req as any).user.data;

  try {
    const userFarm = await prisma.farm.findFirst({
      where: { ownerId: userId },
    });

    if (!userFarm) {
      responseHandler.setError(StatusCodes.NOT_FOUND, 'Farm not found for the logged-in user.');
      return responseHandler.send(res);
    }

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

  try {
    let transactions;

    const farms = await prisma.farm.findMany({
      where: { ownerId: user.userId },
      include: { transactions: true },
    });
    transactions = farms.flatMap(farm => farm.transactions);

    responseHandler.setSuccess(StatusCodes.OK, 'Transactions retrieved successfully.', transactions);
  } catch (error) {
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving transactions.');
  }
  responseHandler.send(res);
};

export const getTransactionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const transaction = await prisma.transaction.findUnique({ where: { id } });

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
