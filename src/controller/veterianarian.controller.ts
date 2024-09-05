import { Request, Response } from "express";
import ResponseHandler from "../util/responseHandler";
import prisma from "../db/prisma";
import { StatusCodes } from "http-status-codes";
import { Roles } from "@prisma/client";

const responseHandler = new ResponseHandler();

export const createVeterinarian = async (req: Request, res: Response) => {
  const { name, phone, email, farmId } = req.body;

  try {
    const emailExist = await prisma.veterinarian.findUnique({ where: { email } });

    if (emailExist) {
      responseHandler.setError(StatusCodes.BAD_REQUEST, "A veterinarian with this email already exists.");
      return responseHandler.send(res);
    }

    const newVeterinarian = await prisma.veterinarian.create({
      data: {
        name,
        phone,
        email,
        farmId
      },
    });
    responseHandler.setSuccess(StatusCodes.CREATED, 'Veterinarian created successfully', newVeterinarian);
  } catch (error) {
    console.error(error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error creating veterinarian');
  }

  return responseHandler.send(res);
};

export const getAllVeterinarians = async (req: Request, res: Response) => {
  const {farmId} = req.params
    const { page = 1, pageSize = 10 } = req.query;
    const currentPage = Math.max(1, Number(page) || 1); // Ensure page is at least 1
    const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100); // Ensure pageSize is between 1 and 100
    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;
    const user = (req as any).user.data;
    let veterinarians;
    try {
      if (user.role === Roles.ADMIN || user.role === Roles.MANAGER) {
        veterinarians = await prisma.veterinarian.findMany({
          where: { farmId },
          skip,
          take,
        });
      } else {
        veterinarians = await prisma.veterinarian.findMany({
          skip,
          take,
        });
      }
      const totalCount = await prisma.veterinarian.count();
  
      responseHandler.setSuccess(StatusCodes.OK, 'Veterinarians retrieved successfully', {
        veterinarians,
        totalPages: Math.ceil(totalCount / Number(pageSize)),
        currentPage: Number(page),
      });
    } catch (error) {
      console.error(error);
      responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving veterinarians');
    }
  
    return responseHandler.send(res);
  };

export const getVeterinarianById = async (req: Request, res: Response) => {
  // const { id } = req.params;
  try {
    const veterinarian = req.veterian
    if (veterinarian) {
      responseHandler.setSuccess(StatusCodes.OK, 'Veterinarian retrieved successfully', veterinarian);
    } else {
      responseHandler.setError(StatusCodes.NOT_FOUND, 'Veterinarian not found');
    }
  } catch (error) {
    console.error(error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving veterinarian');
  }

  return responseHandler.send(res);
};


export const updateVeterinarian = async (req: Request, res: Response) => {
  const { vetId } = req.params;
  const { name, phone, email } = req.body;
  try {
    const veterinarian = await prisma.veterinarian.update({
      where: { id:vetId },
      data: {
        name,
        phone,
        email,
      },
    });
    responseHandler.setSuccess(StatusCodes.OK, 'Veterinarian updated successfully', veterinarian);
  } catch (error) {
    console.error(error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating veterinarian');
  }

  return responseHandler.send(res);
};
