import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../util/responseHandler";
import prisma from "../db/prisma";
import { StatusCodes } from "http-status-codes";
import { paginate } from "../util/paginate";
import { searchUtil } from "../util/search";
import cattleService from "../service/cattle.service";

export const createCattle = async (req: Request, res: Response) => {
  const {
    tagNumber,
    breed,
    gender,
    DOB,
    weight,
    location,
    lastCheckupDate,
    vaccineHistory,
    purchaseDate,
    price,
  } = req.body;
  const { farmId } = req.params;
  // const { tagNumber, breed, gender, DOB, weight, location, farmId, lastCheckupDate, vaccineHistory, purchaseDate, price } = req.body;
  const responseHandler = new ResponseHandler();

  try {
    const tagNumberExist = await prisma.cattle.findUnique({
      where: { tagNumber, farmId },
    });
    // const farmExist = await prisma.farm.findUnique({ where: { id: farmId } });

    if (tagNumberExist) {
      responseHandler.setError(
        StatusCodes.BAD_REQUEST,
        "A cattle with this  tag number already exists."
      );
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
    responseHandler.setSuccess(
      StatusCodes.CREATED,
      "Cattle created successfully",
      newCattle
    );
    return responseHandler.send(res);
  } catch (error) {
    console.log(error);

    responseHandler.setError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error creating cattle"
    );
    return responseHandler.send(res);
  }
};

export const getCattles = async (req: Request, res: Response) => {
  const responseHandler = new ResponseHandler();
  const { page = 1, pageSize = 10, search } = req.query;
  const currentPage = Math.max(1, Number(page) || 1);
  const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100);

  const skip = (currentPage - 1) * currentPageSize;
  const take = currentPageSize;

  try {
    const { farmId } = req.params;
    const searchString: any = typeof search === "string" ? search : "";
    const searchCondition: any = searchString
      ? {
          OR: [
            { tagNumber: { contains: searchString, mode: "insensitive" } }, // Case-insensitive search
            { breed: { contains: searchString, mode: "insensitive" } },
            { gender: { contains: searchString, mode: "insensitive" } },
            { farm: { name: { contains: searchString, mode: "insensitive" } } }, // Searching the farm name
          ],
        }
      : {};
    const cattles = await prisma.cattle.findMany({
      where: {
        farmId,
        ...searchCondition,
      },
      include: { farm: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
    const totalCount = await prisma.cattle.count({
      where: {
        farmId,
        ...searchCondition,
      },
    });
    const paginationResult = paginate(
      cattles,
      totalCount,
      currentPage,
      currentPageSize
    );

    responseHandler.setSuccess(
      StatusCodes.OK,
      "Cattles fetched successfully",
      paginationResult
    );
    return responseHandler.send(res);
  } catch (error) {
    console.error(error);
    responseHandler.setError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error fetching cattles"
    );
    return responseHandler.send(res);
  }
};

export const getCattleById = async (req: Request, res: Response) => {
  const { cattleId } = req.params;
  const responseHandler = new ResponseHandler();

  try {
    const { cattle } = req;
    // const cattle = await prisma.cattle.findUnique({
    //     where: { id },
    // });

    if (!cattle) {
      responseHandler.setError(StatusCodes.NOT_FOUND, "Cattle not found");
      return responseHandler.send(res);
    }

    responseHandler.setSuccess(
      StatusCodes.OK,
      "Cattle fetched successfully",
      cattle
    );
    return responseHandler.send(res);
  } catch (error) {
    responseHandler.setError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error fetching cattle"
    );
    return responseHandler.send(res);
  }
};

export const updateCattle = async (req: Request, res: Response) => {
  const { cattleId } = req.params;
  const {
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
  } = req.body;
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

    responseHandler.setSuccess(
      StatusCodes.OK,
      "Cattle updated successfully",
      updatedCattle
    );
    return responseHandler.send(res);
  } catch (error) {
    responseHandler.setError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error updating cattle"
    );
    return responseHandler.send(res);
  }
};

export const deleteCattle = async (req: Request, res: Response) => {
  const { cattleId } = req.params;
  const responseHandler = new ResponseHandler();

  try {
    await prisma.cattle.delete({
      where: { id: cattleId },
    });
    responseHandler.setSuccess(
      StatusCodes.OK,
      "Cattle deleted successfully",
      null
    );
    return responseHandler.send(res);
  } catch (error) {
    responseHandler.setError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error deleting cattle"
    );
    return responseHandler.send(res);
  }
};

export const getGroupedCattles = async (req: Request, res: Response) => {
  const responseHandler = new ResponseHandler();
  const year = req.params.year || String(new Date().getFullYear());
  const farmId = req.params.farmId
  try {
    const data = await cattleService.getGroupedCattlesSum(year as string, farmId);
    const monthlyCattleCount = data.reduce((acc, record) => {
      if (record.createdAt && String(record.createdAt.getFullYear()) == year) {
        const startMonth = record.createdAt.getMonth()
        for (let i = startMonth; i < 12; i++) {
          acc[i]++;
        }
      }
      return acc;
    }, Array(12).fill(0));

    const formattedGrowth = monthlyCattleCount.map((count, index) => ({
      month: new Date(0, index).toLocaleString("default", { month: "short" }),
      count,
    }));
    responseHandler.setSuccess(
      StatusCodes.OK,
      `Cattles summary (${year}) retrieved successfully`,
      formattedGrowth
    );
    return responseHandler.send(res);
  } catch (error) {
    responseHandler.setError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error retrieving cattle summary"
    );
    return responseHandler.send(res);
  }
};
