import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import ResponseHandler from "../util/responseHandler";

const prisma = new PrismaClient();

export const createCattle = async (req: Request, res: Response) => {
    const { tagNumber, breed, gender, DOB, weight, location, farmId, lastCheckupDate, vaccineHistory, purchaseDate, price } = req.body;
    const responseHandler = new ResponseHandler();

    try {
        const newCattle = await prisma.cattle.create({
            data: {
                tagNumber,
                breed,
                gender,
                DOB,
                weight,
                location,
                farmId,
                lastCheckupDate,
                vaccineHistory,
                purchaseDate,
                price,
            },
        });
        responseHandler.setSuccess(201, 'Cattle created successfully', newCattle);
        return responseHandler.send(res);
    } catch (error) {
        console.log(error);
        
        responseHandler.setError(500, 'Error creating cattle');
        return responseHandler.send(res);
    }
};


export const getCattles = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler();

    try {
        const cattles = await prisma.cattle.findMany();
        responseHandler.setSuccess(200, 'Cattles fetched successfully', cattles);
        return responseHandler.send(res);
    } catch (error) {
        responseHandler.setError(500, 'Error fetching cattles');
        return responseHandler.send(res);
    }
};

export const getCattleById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const responseHandler = new ResponseHandler();

    try {
        const cattle = await prisma.cattle.findUnique({
            where: { id },
        });

        if (!cattle) {
            responseHandler.setError(404, 'Cattle not found');
            return responseHandler.send(res);
        }

        responseHandler.setSuccess(200, 'Cattle fetched successfully', cattle);
        return responseHandler.send(res);
    } catch (error) {
        responseHandler.setError(500, 'Error fetching cattle');
        return responseHandler.send(res);
    }
};

export const updateCattle = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tagNumber, breed, gender, DOB, weight, status, location, farmId, lastCheckupDate, vaccineHistory, purchaseDate, price } = req.body;
    const responseHandler = new ResponseHandler();

    try {
        const updatedCattle = await prisma.cattle.update({
            where: { id },
            data: {
                tagNumber,
                breed,
                gender,
                DOB,
                weight,
                status,
                location,
                farmId,
                lastCheckupDate,
                vaccineHistory,
                purchaseDate,
                price,
            },
        });

        responseHandler.setSuccess(200, 'Cattle updated successfully', updatedCattle);
        return responseHandler.send(res);
    } catch (error) {
        responseHandler.setError(500, 'Error updating cattle');
        return responseHandler.send(res);
    }
};


export const deleteCattle = async (req: Request, res: Response) => {
    const { id } = req.params;
    const responseHandler = new ResponseHandler();

    try {
        await prisma.cattle.delete({
            where: { id },
        });
        responseHandler.setSuccess(204, 'Cattle deleted successfully', null);
        return responseHandler.send(res);
    } catch (error) {
        responseHandler.setError(500, 'Error deleting cattle');
        return responseHandler.send(res);
    }
};
