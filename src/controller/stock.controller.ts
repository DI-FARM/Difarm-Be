import { Request, Response } from 'express';
import ResponseHandler from '../util/responseHandler';
import { Roles } from '../util/enum/Roles.enum';
import prisma from '../db/prisma';
import { StatusCodes } from 'http-status-codes';
import stockService from "../service/stock.service";
import { paginate } from '../util/paginate';

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
  const { farmId } = req.params;
  const user = (req as any).user.data;
  const { page = 1, pageSize = 10 } = req.query;
  const currentPage = Math.max(1, Number(page) || 1); // Ensure page is at least 1
  const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100); // Ensure pageSize is between 1 and 100
  const skip = (currentPage - 1) * currentPageSize;
  const take = currentPageSize;

  try {
    let  stocks;

    if (user.role === Roles.SUPERADMIN) {
      stocks = await prisma.stock.findMany({
        include: { farm: true },
        skip,
        take,
      });
    } else if (user.role === Roles.ADMIN) {
      stocks = await prisma.stock.findMany({
        where: { farmId },
        include: { farm: true },
        skip,
        take,
      });
    } else {
      responseHandler.setError(StatusCodes.FORBIDDEN, 'You do not have permission to view production records.');
      return responseHandler.send(res);
    }
    const totalCount = await prisma.stock.count({
      where: user.role === Roles.ADMIN ? { farmId } : {},
    });
    const paginationResult = paginate(stocks, totalCount, currentPage, currentPageSize);

    responseHandler.setSuccess(StatusCodes.OK, 'Stocks retrieved successfully.', paginationResult);
  } catch (error) {
    console.error(error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving stocks.');
  }

  return responseHandler.send(res);
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
