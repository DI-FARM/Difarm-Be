import { Request, Response } from 'express';
import ResponseHandler from "../util/responseHandler";
import prisma from '../db/prisma';
import { StatusCodes } from 'http-status-codes';


export const createCattle = async (req: Request, res: Response) => {
    const { tagNumber, breed, gender, DOB, weight, location, lastCheckupDate, vaccineHistory, purchaseDate, price } = req.body;
    const {farmId} = req.params
    // const { tagNumber, breed, gender, DOB, weight, location, farmId, lastCheckupDate, vaccineHistory, purchaseDate, price } = req.body;
    const responseHandler = new ResponseHandler();

    try {
        const tagNumberExist = await prisma.cattle.findUnique({ where: { tagNumber,farmId } });
        // const farmExist = await prisma.farm.findUnique({ where: { id: farmId } });

        if (tagNumberExist) {
            responseHandler.setError(StatusCodes.BAD_REQUEST, "A cattle with this  tag number already exists.");
            return responseHandler.send(res);
        }

        // if (!farmExist) {
        //     responseHandler.setError(StatusCodes.NOT_FOUND, "Farm not found.");
        //     return responseHandler.send(res);
        // }
        const weightFloat = parseFloat(weight);
        const priceFloat = parseFloat(price);

        const newCattle = await prisma.cattle.create({
            data: {
                tagNumber,
                breed,
                gender,
                DOB,
                weight: weightFloat,
                location,
                farmId,
                lastCheckupDate,
                vaccineHistory,
                purchaseDate,
                price: priceFloat,
            },
        });
        responseHandler.setSuccess(StatusCodes.CREATED, 'Cattle created successfully', newCattle);
        return responseHandler.send(res);
    } catch (error) {
        console.log(error);
        
        responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error creating cattle');
        return responseHandler.send(res);
    }
};


export const getCattles = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler();
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    try {
        const {farmId} = req.params
        const cattles = await prisma.cattle.findMany({
          where: { farmId },
          include: { farm: true },
          orderBy: {
            createdAt: 'desc',
        },
        skip,
        take
        });

        const totalCount = await prisma.cattle.count();

        responseHandler.setSuccess(StatusCodes.OK, 'Cattles fetched successfully', {
            cattles,
            totalPages: Math.ceil(totalCount / Number(pageSize)),
            currentPage: Number(page),
        });
        return responseHandler.send(res);
    } catch (error) {
        console.error(error);
        responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching cattles');
        return responseHandler.send(res);
    }
};

export const getCattleById = async (req: Request, res: Response) => {
    const { cattleId } = req.params;
    const responseHandler = new ResponseHandler();

    try {
        const {cattle} = req
        // const cattle = await prisma.cattle.findUnique({
        //     where: { id },
        // });

        if (!cattle) {
            responseHandler.setError(StatusCodes.NOT_FOUND, 'Cattle not found');
            return responseHandler.send(res);
        }

        responseHandler.setSuccess(StatusCodes.OK, 'Cattle fetched successfully', cattle);
        return responseHandler.send(res);
    } catch (error) {
        responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching cattle');
        return responseHandler.send(res);
    }
};

export const updateCattle = async (req: Request, res: Response) => {
    const { cattleId } = req.params;
    const { tagNumber, breed, gender, DOB, weight, status, location, farmId, lastCheckupDate, vaccineHistory, purchaseDate, price } = req.body;
    const responseHandler = new ResponseHandler();

    try {
        const updatedCattle = await prisma.cattle.update({
            where: { id: cattleId },
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

        responseHandler.setSuccess(StatusCodes.OK, 'Cattle updated successfully', updatedCattle);
        return responseHandler.send(res);
    } catch (error) {
        responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating cattle');
        return responseHandler.send(res);
    }
};


export const deleteCattle = async (req: Request, res: Response) => {
    const { cattleId } = req.params;
    const responseHandler = new ResponseHandler();

    try {
        await prisma.cattle.delete({
            where: { id:cattleId },
        });
        responseHandler.setSuccess(StatusCodes.OK, 'Cattle deleted successfully', null);
        return responseHandler.send(res);
    } catch (error) {
        responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error deleting cattle');
        return responseHandler.send(res);
    }
};
