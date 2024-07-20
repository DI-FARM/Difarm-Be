import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import ResponseHandler from "../util/responseHandler";
import prisma from "../db/prisma";
import { sendEmail } from "../service/sendEmail.service";


const responseHandler = new ResponseHandler();

export const createFarm = async (req: Request, res: Response) => {
    const { name, location, size, type, ownerId} = req.body;
    

    try {

        const nameExist = await prisma.farm.findUnique({ where: { name } });

        if (nameExist) {
            responseHandler.setError(StatusCodes.BAD_REQUEST, "A farm with this name already exists.");
            return responseHandler.send(res);
        }

        const newFarm = await prisma.farm.create({
            data: {
                name,
                location,
                size,
                type,
                ownerId
            },
        });
        responseHandler.setSuccess(201, 'Farm created successfully', newFarm);
    } catch (error) {
        console.log(error);
        
        responseHandler.setError(500, 'Error creating farm');
    }

    return responseHandler.send(res);
};

export const getFarms = async (req: Request, res: Response) => {
    

    try {
        const farms = await prisma.farm.findMany({ include: { owner: true } });
        responseHandler.setSuccess(200, 'Farms retrieved successfully', farms);
    } catch (error) {
        responseHandler.setError(500, 'Error fetching farms');
    }

    responseHandler.send(res);
};

export const getFarmById = async (req: Request, res: Response) => {
    const { id } = req.params;
    

    try {
        const farm = await prisma.farm.findUnique({
            where: { id },
        });

        if (!farm) {
            responseHandler.setError(404, 'Farm not found');
        } else {
            responseHandler.setSuccess(200, 'Farm retrieved successfully', farm);
        }
    } catch (error) {
        responseHandler.setError(500, 'Error fetching farm');
    }

    responseHandler.send(res);
};

export const updateFarm = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, location, size, type, ownerId, status } = req.body;
    

    try {
        const updatedFarm = await prisma.farm.update({
            where: { id },
            data: {
                name,
                location,
                size,
                type,
                ownerId,
                status,
            },
        });

        responseHandler.setSuccess(200, 'Farm updated successfully', updatedFarm);
    } catch (error) {
        responseHandler.setError(500, 'Error updating farm');
    }

    responseHandler.send(res);
};

export const deleteFarm = async (req: Request, res: Response) => {
    const { id } = req.params;
    

    try {
        await prisma.farm.delete({
            where: { id },
        });
        responseHandler.setSuccess(204, 'Farm deleted successfully', null);
    } catch (error) {
        responseHandler.setError(500, 'Error deleting farm');
    }

    responseHandler.send(res);
};