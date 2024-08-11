import { Request, Response } from 'express';
import ResponseHandler from '../util/responseHandler';
import { Roles } from '../util/enum/Roles.enum';
import prisma from '../db/prisma';
import { StatusCodes } from 'http-status-codes';
import stockService from "../service/stock.service";

const responseHandler = new ResponseHandler();

export const createStock = async (req: Request, res: Response) => {
  const { name, quantity, type } = req.body;
  // const userId = (req as any).user.data.userId;

  try {
    const userFarm = req.farm
    // const userFarm = await prisma.farm.findFirst({
    //   where: { ownerId: userId },
    // });

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
        type
      },
    });

    responseHandler.setSuccess(StatusCodes.CREATED, 'Stock created successfully.', newStock);
  } catch (error) {
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while creating the stock.');
  }
  responseHandler.send(res);
};

export const getAllStocks = async (req: Request, res: Response) => {
  // const user = (req as any).user.data;
  const {farmId} = req.params
  try {
    let stocks;
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    stocks = await stockService.getAllStocks(farmId,skip,take);


    responseHandler.setSuccess(StatusCodes.OK, 'Stocks retrieved successfully.', {
      stocks,
      // totalPages: Math.ceil(totalCount / Number(pageSize)),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error(error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving stocks.');
  }
  responseHandler.send(res);
};


export const getStockById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // const stock = await prisma.stock.findUnique({ where: { id } });
    const stock = req.stock

    // if (!stock) {
    //   responseHandler.setError(StatusCodes.NOT_FOUND, 'Stock not found.');
    //   return responseHandler.send(res);
    // }

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
