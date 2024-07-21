import { Request, Response } from 'express';
import prisma from '../db/prisma';
import ResponseHandler from '../util/responseHandler';
import { Roles } from '../util/enum/Roles.enum';
import { StatusCodes } from 'http-status-codes';

const responseHandler = new ResponseHandler();

export const createProduction = async (req: Request, res: Response) => {
    const { cattleId, productName, quantity, productionDate, expirationDate } = req.body;
    const { userId } = (req as any).user.data;

    try {
        const userFarm = await prisma.farm.findFirst({
            where: { ownerId: userId },
        });

        if (!userFarm) {
            responseHandler.setError(404, 'Farm not found for the logged-in user.');
            return responseHandler.send(res);
        }

        const cattleExist = await prisma.cattle.findUnique({ where: { id: cattleId } });

        if (!cattleExist) {
            responseHandler.setError(StatusCodes.NOT_FOUND, "Cattle not found.");
            return responseHandler.send(res);
        }

        const quantityFloat = parseFloat(quantity);
        const newProduction = await prisma.production.create({
            data: {
                farmId: userFarm.id,
                cattleId,
                productName,
                quantity: quantityFloat,
                productionDate: new Date(productionDate),
                expirationDate: expirationDate ? new Date(expirationDate) : null,
            },
        });
        responseHandler.setSuccess(StatusCodes.CREATED, 'Production record created successfully.', newProduction);
    } catch (error) {
        console.log(error);
        responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while creating the production record.');
    }
    responseHandler.send(res);
};

export const getAllProductions = async (req: Request, res: Response) => {
    const user = (req as any).user.data;

    try {
        let productions;
        if (user.role === Roles.SUPERADMIN) {
            productions = await prisma.production.findMany({
                include: { cattle: true },
            });
        } else if (user.role === Roles.ADMIN) {
            const farms = await prisma.farm.findMany({
                where: { ownerId: user.id },
                include: { productions: { include: { cattle: true } } },
            });
            productions = farms.flatMap(farm => farm.productions);
        } else {
            responseHandler.setError(StatusCodes.FORBIDDEN, 'You do not have permission to view production records.');
            return responseHandler.send(res);
        }

        responseHandler.setSuccess(StatusCodes.OK, 'Production records retrieved successfully.', productions);
    } catch (error) {
        responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving production records.');
    }
    responseHandler.send(res);
};

export const getProductionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.data.id;

    try {
        const production = await prisma.production.findUnique({
            where: { id },
            include: { cattle: true },
        });

        if (!production) {
            responseHandler.setError(StatusCodes.NOT_FOUND, 'Production record not found.');
            return responseHandler.send(res);
        }

        responseHandler.setSuccess(StatusCodes.OK, 'Production record retrieved successfully.', production);
    } catch (error) {
        responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while retrieving the production record.');
    }
    responseHandler.send(res);
};

export const updateProduction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { productName, quantity, productionDate, expirationDate } = req.body;
    const userId = (req as any).user.data.id;

    try {
        const updatedProduction = await prisma.production.update({
            where: { id },
            data: {
                productName,
                quantity,
                productionDate: productionDate ? new Date(productionDate) : undefined,
                expirationDate: expirationDate ? new Date(expirationDate) : undefined,
            },
            include: { cattle: true },
        });
        responseHandler.setSuccess(StatusCodes.OK, 'Production record updated successfully.', updatedProduction);
    } catch (error) {
        responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while updating the production record.');
    }
    responseHandler.send(res);
};

export const deleteProduction = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.production.delete({
            where: { id },
        });
        responseHandler.setSuccess(StatusCodes.OK, 'Production record deleted successfully.', { data: null });
    } catch (error) {
        responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while deleting the production record.');
    }
    responseHandler.send(res);
};
