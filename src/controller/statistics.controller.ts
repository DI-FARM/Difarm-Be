import { Request, Response } from 'express';
import prisma from '../db/prisma';
import ResponseHandler from '../util/responseHandler';

const responseHandler = new ResponseHandler();


export const createStatisticsReport = async (req: Request, res: Response) => {
    try {
     
      const cattleCount = await prisma.cattle.count();
      const healthyCattleCount = await prisma.cattle.count({ where: { status: 'HEALTHY' } });
      const sickCattleCount = await prisma.cattle.count({ where: { status: 'SICK' } });
      const soldCattleCount = await prisma.cattle.count({ where: { status: 'SOLD' } });
  
     
      const totalProduction = await prisma.production.aggregate({
        _sum: {
          quantity: true
        }
      });
  
      const productionByType = await prisma.production.groupBy({
        by: ['productName'],
        _sum: {
          quantity: true
        }
      });
  
      
      const totalStockQuantity = await prisma.stock.aggregate({
        _sum: {
          quantity: true
        }
      });
  
      const stockByType = await prisma.stock.groupBy({
        by: ['type'],
        _sum: {
          quantity: true
        }
      });
  
     
      const totalInseminations = await prisma.insemination.count();
      const inseminationByType = await prisma.insemination.groupBy({
        by: ['type'],
        _count: {
          _all: true
        }
      });
  
     
      const totalVaccinations = await prisma.vaccination.count();
      const vaccinationByType = await prisma.vaccination.groupBy({
        by: ['vaccineType'],
        _count: {
          _all: true
        }
      });
  
     
      const report = {
        cattle: {
          total: cattleCount,
          healthy: healthyCattleCount,
          sick: sickCattleCount,
          sold: soldCattleCount,
        },
        production: {
          totalQuantity: totalProduction._sum.quantity || 0,
          byProduct: productionByType.map(item => ({
            productName: item.productName,
            quantity: item._sum.quantity || 0
          }))
        },
        stock: {
          totalQuantity: totalStockQuantity._sum.quantity || 0,
          byType: stockByType.map(item => ({
            type: item.type,
            quantity: item._sum.quantity || 0
          }))
        },
        insemination: {
          total: totalInseminations,
          byType: inseminationByType.map(item => ({
            type: item.type,
            count: item._count._all || 0
          }))
        },
        vaccination: {
          total: totalVaccinations,
          byVaccineType: vaccinationByType.map(item => ({
            vaccineType: item.vaccineType,
            count: item._count._all || 0
          }))
        }
      };
  
     
      res.status(200).json({ success: true, data: report });
    } catch (error) {
      console.error('Error generating statistics report:', error);
      res.status(500).json({ success: false, message: 'Failed to generate statistics report' });
    }
  };