import { Request, Response } from 'express';
import ResponseHandler from '../util/responseHandler';
import { Roles } from '../util/enum/Roles.enum';
import prisma from '../db/prisma';
import { StatusCodes } from 'http-status-codes';

const responseHandler = new ResponseHandler();

export const createStock = async (req: Request, res: Response) => {
  const { name, quantity } = req.body;
  const userId = (req as any).user.data.userId;

  try {
    const userFarm = await prisma.farm.findFirst({
      where: { ownerId: userId },
    });

    if (!userFarm) {
      responseHandler.setError(StatusCodes.NOT_FOUND, 'Farm not found for the logged-in user.');
      return responseHandler.send(res);
    }
    const quantityFloat = parseFloat(quantity);
    const newStock = await prisma.stock.create({
      data: {
        name,
        quantity: quantityFloat,
        farmId: userFarm.id,
      },
    });

    responseHandler.setSuccess(StatusCodes.CREATED, 'Stock created successfully.', newStock);
  } catch (error) {
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while creating the stock.');
  }
  responseHandler.send(res);
};

export const getAllStocks = async (req: Request, res: Response) => {
  const user = (req as any).user.data;

  try {
    let stocks;

    const farms = await prisma.farm.findMany({
      where: { ownerId: user.useId },
      include: { stocks: true },
    });
    stocks = farms.flatMap(farm => farm.stocks);

    responseHandler.setSuccess(StatusCodes.OK, 'Stocks retrieved successfully.', stocks);
  } catch (error) {
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving stocks.');
  }
  responseHandler.send(res);
};

export const getStockById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const stock = await prisma.stock.findUnique({ where: { id } });

    if (!stock) {
      responseHandler.setError(StatusCodes.NOT_FOUND, 'Stock not found.');
      return responseHandler.send(res);
    }

    responseHandler.setSuccess(StatusCodes.OK, 'Stock retrieved successfully.', stock);
  } catch (error) {
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving the stock.');
  }
  responseHandler.send(res);
};

export const updateStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  try {
    const updatedStock = await prisma.stock.update({
      where: { id },
      data: { name, quantity },
    });

    responseHandler.setSuccess(StatusCodes.OK, 'Stock updated successfully.', updatedStock);
  } catch (error) {
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while updating the stock.');
  }
  responseHandler.send(res);
};

export const deleteStock = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.stock.delete({ where: { id } });
    responseHandler.setSuccess(StatusCodes.OK, 'Stock deleted successfully.', { data: null });
  } catch (error) {
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while deleting the stock.');
  }
  responseHandler.send(res);
};
