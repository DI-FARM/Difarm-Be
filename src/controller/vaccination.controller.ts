import { Request, Response } from "express";
import ResponseHandler from '../util/responseHandler';
import prisma from '../db/prisma';
import { StatusCodes } from "http-status-codes";
import { Roles, Vaccination } from "@prisma/client";
import { paginate } from "../util/paginate";

const responseHandler = new ResponseHandler();

export const recordVaccination = async (req: Request, res: Response) => {

    const {cattleId, date, vaccineType, vetId, farmId, price } = req.body;
    try {
        const newVaccination = await prisma.vaccination.create({
          data: {
            cattleId,
            date: new Date(date),
            vaccineType,
            price,
            vetId,
            farmId
          },
        });
        responseHandler.setSuccess(StatusCodes.CREATED, 'Vaccination created successfully', newVaccination);
      } catch (error) {
        console.error(error);
        responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error creating vaccination');
      }
    
      return responseHandler.send(res);
}

export const getAllVaccinations = async (req: Request, res: Response) => {
  const responseHandler = new ResponseHandler();
  const user = (req as any).user.data;
  const { farmId } = req.params;
  const { page = 1, pageSize = 10 } = req.query;
  const currentPage = Math.max(1, Number(page) || 1);
  const currentPageSize = Math.min(Math.max(1, Number(pageSize) || 10), 100);
  const skip = (currentPage - 1) * currentPageSize;
  const take = currentPageSize;

  try {
    let vaccinations;

    if (user.role === Roles.ADMIN || user.role === Roles.MANAGER) {
      vaccinations = await prisma.vaccination.findMany({
        where: { farmId },
        orderBy: { date: 'desc' },
        include: { cattle: true, veterinarian: true },
        skip,
        take,
      });
    } else {
      vaccinations = await prisma.vaccination.findMany({
        orderBy: { date: 'desc' },
        include: { cattle: true,veterinarian:true },
        skip,
        take,
      });
    }

    const totalCount = await prisma.vaccination.count({
      where: user.role === Roles.ADMIN || user.role === Roles.MANAGER ? { farmId } : {},
    });


    const paginationResult = paginate(vaccinations, totalCount, currentPage, currentPageSize);

    responseHandler.setSuccess(StatusCodes.OK, 'Vaccinations retrieved successfully', paginationResult);
  } catch (error) {
    console.error('Error retrieving vaccinations:', error);
    responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving vaccinations');
  }

  return responseHandler.send(res);
};

  export const getVaccinationById = async (req: Request, res: Response) => {
    // const { id } = req.params;
    try {
      const vaccination = req.vaccine
      if (vaccination) {
        responseHandler.setSuccess(StatusCodes.OK, 'Vaccination retrieved successfully', vaccination);
      } else {
        responseHandler.setError(StatusCodes.NOT_FOUND, 'Vaccination not found');
      }
    } catch (error) {
      console.error(error);
      responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving vaccination');
    }
  
    return responseHandler.send(res);
  };
  
  export const updateVaccination = async (req: Request, res: Response) => {
    const { vaccineId } = req.params;
    const { cattleId, date, vaccineType, vetId, price } = req.body;
    try {
      const vaccination = await prisma.vaccination.update({
        where: { id:vaccineId },
        data: {
          cattleId,
          date: new Date(date),
          vaccineType,
          price,
          vetId,
        },
      });
      responseHandler.setSuccess(StatusCodes.OK, 'Vaccination updated successfully', vaccination);
    } catch (error) {
      console.error(error);
      responseHandler.setError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating vaccination');
    }
  
    return responseHandler.send(res);
  };
  
// Get vaccination count by month for a year
export const getVaccinationsByYear = async (req: Request, res: Response) => {
  const { farmId, year } = req.params;
  const responseHandler = new ResponseHandler();
  
  try {
    const targetYear = parseInt(year);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const vaccinationData = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthStart = new Date(targetYear, monthIndex, 1);
      const monthEnd = new Date(targetYear, monthIndex + 1, 0, 23, 59, 59, 999);

      const vaccinationCount = await prisma.vaccination.count({
        where: {
          farmId,
          date: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      });

      vaccinationData.push({
        month: months[monthIndex],
        monthNumber: monthIndex + 1,
        count: vaccinationCount
      });
    }

    responseHandler.setSuccess(
      StatusCodes.OK,
      `Vaccinations for ${year} fetched successfully`,
      {
        farmId,
        year: targetYear,
        monthlyData: vaccinationData
      }
    );
  } catch (error) {
    responseHandler.setError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error fetching vaccinations by year"
    );
  } finally {
    return responseHandler.send(res);
  }
};

// Get insemination count by month for a year
export const getInseminationsByYear = async (req: Request, res: Response) => {
  const { farmId, year } = req.params;
  const responseHandler = new ResponseHandler();
  
  try {
    const targetYear = parseInt(year);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const inseminationData = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthStart = new Date(targetYear, monthIndex, 1);
      const monthEnd = new Date(targetYear, monthIndex + 1, 0, 23, 59, 59, 999);

      const inseminationCount = await prisma.insemination.count({
        where: {
          farmId,
          date: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      });

      inseminationData.push({
        month: months[monthIndex],
        monthNumber: monthIndex + 1,
        count: inseminationCount
      });
    }

    responseHandler.setSuccess(
      StatusCodes.OK,
      `Inseminations for ${year} fetched successfully`,
      {
        farmId,
        year: targetYear,
        monthlyData: inseminationData
      }
    );
  } catch (error) {
    responseHandler.setError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error fetching inseminations by year"
    );
  } finally {
    return responseHandler.send(res);
  }
};

export const getTotalVaccinations = async (req: Request, res: Response) => {
  const { farmId } = req.params;
  const responseHandler = new ResponseHandler();
  
  try {
    const totalVaccinations = await prisma.vaccination.count({ where: { farmId } });
    responseHandler.setSuccess(
      StatusCodes.OK,
      "Total vaccinations fetched successfully",
      totalVaccinations
    );
  } catch (error) {
    responseHandler.setError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error fetching total vaccinations"
    );
  } finally {
    return responseHandler.send(res);
  }
};

export const getTotalInseminations = async (req: Request, res: Response) => {
  const { farmId } = req.params;
  const responseHandler = new ResponseHandler();
  
  try {
    const totalInseminations = await prisma.insemination.count({ where: { farmId } });
    responseHandler.setSuccess(
      StatusCodes.OK,
      "Total inseminations fetched successfully",
      totalInseminations
    );
  } catch (error) {
    responseHandler.setError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error fetching total inseminations"
    );
  } finally {
    return responseHandler.send(res);
  }
};