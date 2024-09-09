import { Request, Response } from "express";
import prisma from "../db/prisma";
import { StatusCodes } from "http-status-codes";
import ResponseHandler from "../util/responseHandler";
import { Roles } from "@prisma/client";
import { paginate } from "../util/paginate";


const responseHandler = new ResponseHandler();

export const recordInsemination = async (req: Request, res: Response) => {
  const { cattleId, date, method, type, vetId,farmId } = req.body;

  try {
    const newInsemination = await prisma.insemination.create({
      data: {
        cattleId,
        date: new Date(date),
        type,
        method,
        vetId,
        farmId
      },
    });
    responseHandler.setSuccess(StatusCodes.CREATED, 'Insemination created successfully', newInsemination);
  } catch (error) {
    console.error(error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error creating insemination');
  }

  return responseHandler.send(res);
};




export const getAllInseminations = async (req: Request, res: Response) => {
  const responseHandler = new ResponseHandler();

  const { page = 1, pageSize = 10 } = req.query;
  const currentPage = Math.max(1, Number(page) || 1);
  const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100);

  const skip = (currentPage - 1) * currentPageSize;
  const take = currentPageSize;

  const user = (req as any).user.data;

  try {
   let inseminations;

    if (user.role === Roles.ADMIN || user.role === Roles.MANAGER) {
      inseminations = await prisma.insemination.findMany({
        where: { farmId: req.params.farmId },
        include: { cattle: true, veterinarian: true },
        orderBy: { date: 'desc' },
        skip,
        take,
      });
    } else {
      inseminations = await prisma.insemination.findMany({
        include: { cattle: true,veterinarian:true },
        orderBy: { date: 'desc' },
        skip,
        take,
      });
    }
    const totalCount = await prisma.insemination.count({
      where: user.role === Roles.ADMIN || user.role === Roles.MANAGER ? { farmId: req.params.farmId } : {},
    });
    const paginationResult = paginate(inseminations, totalCount, currentPage, currentPageSize);

    responseHandler.setSuccess(StatusCodes.OK, 'Inseminations retrieved successfully', paginationResult);
  } catch (error) {
    console.error('Error retrieving inseminations:', error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving inseminations');
  }

  return responseHandler.send(res);
};
export const getInseminationById = async (req: Request, res: Response) => {
  // const { id } = req.params;
  try {
    const insemination = req.insemination
    if (insemination) {
      responseHandler.setSuccess(StatusCodes.OK, 'Insemination retrieved successfully', insemination);
    } else {
      responseHandler.setError(StatusCodes.NOT_FOUND, 'Insemination not found');
    }
  } catch (error) {
    console.error(error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving insemination');
  }

  return responseHandler.send(res);
};

export const updateInsemination = async (req: Request, res: Response) => {
  const { inseminationId } = req.params;
  const { cattleId, date, method, vetId } = req.body;
  try {
    const insemination = await prisma.insemination.update({
      where: { id:inseminationId },
      data: {
        cattleId,
        date: new Date(date),
        method,
        vetId,
      },
    });
    responseHandler.setSuccess(StatusCodes.OK, 'Insemination updated successfully', insemination);
  } catch (error) {
    console.error(error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating insemination');
  }

  return responseHandler.send(res);
};