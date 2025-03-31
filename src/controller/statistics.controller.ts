import { Request, Response } from 'express';
import prisma from '../db/prisma';
import ResponseHandler from '../util/responseHandler';
import { getFarmByUserId } from '../service/getFarm.service';

const responseHandler = new ResponseHandler();


export const createStatisticsReport = async (req: Request, res: Response) => {
  try {

    const cattleCount = await prisma.cattle.count();
    const healthyCattleCount = await prisma.cattle.count({ where: { status: 'HEALTHY' } });
    const sickCattleCount = await prisma.cattle.count({ where: { status: 'SICK' } });
    const soldCattleCount = await prisma.cattle.count({ where: { status: 'SOLD' } });
    const processedCount = await prisma.cattle.count({ where: {  status: 'PROCESSED' } });


    const calculatePercentage = (part: number, total: number) => {
      return total > 0 ? (part / total) * 100 : 0;
    };
    
    const healthyCattlePercentage = calculatePercentage(healthyCattleCount, cattleCount);
    const sickCattlePercentage = calculatePercentage(sickCattleCount, cattleCount);
    const soldCattlePercentage = calculatePercentage(soldCattleCount, cattleCount);
    const processedCattleParcentage = calculatePercentage(processedCount, cattleCount);


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

    const totalProductionQuantity = totalProduction._sum.quantity || 0;
    const productionPercentageByType = productionByType.map(item => ({
      productName: item.productName,
      quantity: item._sum.quantity || 0,
      percentage: calculatePercentage(item._sum.quantity || 0, totalProductionQuantity)
    }));

    // Fetch the stock data, group by the item category
const farmId = req.params.farmId; // Define farmId

const stockByCategory = await prisma.stock.groupBy({
  by: ['itemId'], // Group by itemId to access the item's category
  where: { farmId },
  _sum: {
    balanceInStock: true, // Sum the balanceInStock
  },
});

const itemDetails = await prisma.item.findMany({
  where: {
    id: {
      in: stockByCategory.map(item => item.itemId),
    },
  },
});

// Calculate the total stock balance
const totalStock = stockByCategory.reduce(
  (sum, item) => sum + (item._sum.balanceInStock || 0),
  0
);

// Map the grouped data to categorize by item category and calculate percentage
const stockPercentageByCategory = stockByCategory.map(item => {
  const itemDetail = itemDetails.find(detail => detail.id === item.itemId);
  const category = itemDetail?.categoryId; // Access the category of the item

  // If there's no category, skip
  if (!category) return null;

  return {
    category: category, // Category name
    quantity: item._sum.balanceInStock || 0, // Quantity in stock for this category
    percentage: calculatePercentage(item._sum.balanceInStock || 0, totalStock), // Calculate percentage
  };
}).filter(Boolean); // Remove any null values if category is missing

console.log(stockPercentageByCategory);


    const totalInseminations = await prisma.insemination.count();
    const inseminationByType = await prisma.insemination.groupBy({
      by: ['type'],
      _count: {
        _all: true
      }
    });

    const inseminationPercentageByType = inseminationByType.map(item => ({
      type: item.type,
      count: item._count._all || 0,
      percentage: calculatePercentage(item._count._all || 0, totalInseminations)
    }));

    const totalVaccinations = await prisma.vaccination.count();
    const vaccinationByType = await prisma.vaccination.groupBy({
      by: ['vaccineType'],
      _count: {
        _all: true
      }
    });

    const vaccinationPercentageByType = vaccinationByType.map(item => ({
      vaccineType: item.vaccineType,
      count: item._count._all || 0,
      percentage: calculatePercentage(item._count._all || 0, totalVaccinations)
    }));

    const report = {
      cattle: {
        total: cattleCount,
        healthy: {
          count: healthyCattleCount,
          percentage: healthyCattlePercentage
        },
        sick: {
          count: sickCattleCount,
          percentage: sickCattlePercentage
        },
        sold: {
          count: soldCattleCount,
          percentage: soldCattlePercentage
        },
        processed: {
          count: processedCount,
          percentage: processedCattleParcentage
        }
      },
      production: {
        totalQuantity: totalProductionQuantity,
        byProduct: productionPercentageByType
      },
      stock: {
        totalQuantity: totalStock,
        byType: stockPercentageByCategory
      },
      insemination: {
        total: totalInseminations,
        byType: inseminationPercentageByType
      },
      vaccination: {
        total: totalVaccinations,
        byVaccineType: vaccinationPercentageByType
      }
    };


    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error generating statistics report:', error);
    res.status(500).json({ success: false, message: 'Failed to generate statistics report' });
  }
};

export const createStatisticsReportFarm = async (req: Request, res: Response) => {
  try {

    const userId = (req.user as any).data.userId;

    if (!userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: User ID is missing' });
    }

    const farm = await getFarmByUserId(userId);

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found for the current user' });
    }

    const farmId = farm.id;
    const cattleCount = await prisma.cattle.count({ where: { farmId } });
    const healthyCattleCount = await prisma.cattle.count({ where: { farmId, status: 'HEALTHY' } });
    const sickCattleCount = await prisma.cattle.count({ where: { farmId, status: 'SICK' } });
    const soldCattleCount = await prisma.cattle.count({ where: { farmId, status: 'SOLD' } });
    const processedCount = await prisma.cattle.count({ where: { farmId, status: 'PROCESSED' } });

    const calculatePercentage = (part: number, total: number) => {
      return total > 0 ? (part / total) * 100 : 0;
    };
    
    const healthyCattlePercentage = calculatePercentage(healthyCattleCount, cattleCount);
    const sickCattlePercentage = calculatePercentage(sickCattleCount, cattleCount);
    const soldCattlePercentage = calculatePercentage(soldCattleCount, cattleCount);
    const processedCattleParcentage = calculatePercentage(processedCount, cattleCount);


    const totalProduction = await prisma.production.aggregate({
      where: { farmId },
      _sum: {
        quantity: true
      }
    });

    const productionByType = await prisma.production.groupBy({
      by: ['productName'],
      where: { farmId },
      _sum: {
        quantity: true
      }
    });

    const totalProductionQuantity = totalProduction._sum.quantity || 0;
    const productionPercentageByType = productionByType.map(item => ({
      productName: item.productName,
      quantity: item._sum.quantity || 0,
      percentage: calculatePercentage(item._sum.quantity || 0, totalProductionQuantity)
    }));

    const totalStockQuantity = await prisma.stock.aggregate({
      where: { farmId },
      _sum: {
        balanceInStock: true
      }
    });

    const stockByCategory = await prisma.stock.groupBy({
      by: ['itemId'], // Group by itemId (since Stock has a relation to Item)
      where: { farmId },
      _sum: {
        balanceInStock: true, // Sum balanceInStock for each item
      },
    });
    
    const itemDetails = await prisma.item.findMany({
      where: {
        id: {
          in: stockByCategory.map(item => item.itemId),
        },
      },
    });

    const stockByCategoryGrouped = stockByCategory.reduce((acc: { [key: string]: any }, item) => {
      const itemDetail = itemDetails.find(detail => detail.id === item.itemId);
      const category = itemDetail?.categoryId; // Get the category from the item
    
      if (!category) return acc; // Skip if no category
    
      if (!acc[category]) {
        acc[category] = {
          category,
          totalBalanceInStock: 0,
          items: [],
        };
      }
    
      // Add the balanceInStock to the category total
      acc[category].totalBalanceInStock += item._sum.balanceInStock || 0;
    
      // Add the item to the category's items array
      acc[category].items.push({
        itemId: item.itemId,
        balanceInStock: item._sum.balanceInStock || 0,
        itemName: itemDetail?.name,
      });
    
      return acc;
    }, {});
    
    const totalStock = Object.values(stockByCategoryGrouped).reduce(
      (sum, category) => sum + category.totalBalanceInStock,
      0
    );
    
    const stockPercentageByCategory = Object.values(stockByCategoryGrouped).map(
      (category) => ({
        category: category.category,
        totalBalanceInStock: category.totalBalanceInStock,
        percentage: calculatePercentage(category.totalBalanceInStock, totalStock),
        items: category.items,
      })
    );

    const totalInseminations = await prisma.insemination.count({
      where: { farm: { id: farmId } }
    });
    const inseminationByType = await prisma.insemination.groupBy({
      by: ['type'],
      where: { farm: { id: farmId } },
      _count: {
        _all: true
      }
    });

    const inseminationPercentageByType = inseminationByType.map(item => ({
      type: item.type,
      count: item._count._all || 0,
      percentage: calculatePercentage(item._count._all || 0, totalInseminations)
    }));

    const totalVaccinations = await prisma.vaccination.count({
      where: { farm: { id: farmId } }
    });
    const vaccinationByType = await prisma.vaccination.groupBy({
      by: ['vaccineType'],
      where: { farm: { id: farmId } },
      _count: {
        _all: true
      }
    });

    const vaccinationPercentageByType = vaccinationByType.map(item => ({
      vaccineType: item.vaccineType,
      count: item._count._all || 0,
      percentage: calculatePercentage(item._count._all || 0, totalVaccinations)
    }));

    const report = {
      cattle: {
        total: cattleCount,
        healthy: {
          count: healthyCattleCount,
          percentage: healthyCattlePercentage
        },
        sick: {
          count: sickCattleCount,
          percentage: sickCattlePercentage
        },
        sold: {
          count: soldCattleCount,
          percentage: soldCattlePercentage
        }
        ,
        processed: {
          count: processedCount,
          percentage: processedCattleParcentage
        }
      },
      production: {
        totalQuantity: totalProductionQuantity,
        byProduct: productionPercentageByType
      },
      stock: {
        totalQuantity: totalStock,
        byType: stockPercentageByCategory
      },
      insemination: {
        total: totalInseminations,
        byType: inseminationPercentageByType
      },
      vaccination: {
        total: totalVaccinations,
        byVaccineType: vaccinationPercentageByType
      }
    };


    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error generating statistics report:', error);
    res.status(500).json({ success: false, message: 'Failed to generate statistics report' });
  }
};

export const createStatisticsReportFarmId = async (req: Request, res: Response) => {
  try {

    

    const farmId = req.params.farmId;
    const cattleCount = await prisma.cattle.count({ where: { farmId } });
    const healthyCattleCount = await prisma.cattle.count({ where: { farmId, status: 'HEALTHY' } });
    const sickCattleCount = await prisma.cattle.count({ where: { farmId, status: 'SICK' } });
    const soldCattleCount = await prisma.cattle.count({ where: { farmId, status: 'SOLD' } });
    const processedCount = await prisma.cattle.count({ where: { farmId, status: 'PROCESSED' } });


    const calculatePercentage = (part: number, total: number) => {
      return total > 0 ? (part / total) * 100 : 0;
    };
    
    const healthyCattlePercentage = calculatePercentage(healthyCattleCount, cattleCount);
    const sickCattlePercentage = calculatePercentage(sickCattleCount, cattleCount);
    const soldCattlePercentage = calculatePercentage(soldCattleCount, cattleCount);
    const processedCattleParcentage = calculatePercentage(processedCount, cattleCount);



    const totalProduction = await prisma.production.aggregate({
      where: { farmId },
      _sum: {
        quantity: true
      }
    });

    const productionByType = await prisma.production.groupBy({
      by: ['productName'],
      where: { farmId },
      _sum: {
        quantity: true
      }
    });

    const totalProductionQuantity = totalProduction._sum.quantity || 0;
    const productionPercentageByType = productionByType.map(item => ({
      productName: item.productName,
      quantity: item._sum.quantity || 0,
      percentage: calculatePercentage(item._sum.quantity || 0, totalProductionQuantity)
    }));

    const totalStockQuantity = await prisma.stock.aggregate({
      where: { farmId },
      _sum: {
        balanceInStock: true
      }
    });

    const stockByType = await prisma.stock.groupBy({
      by: ['itemId'],
      where: { farmId },
      _sum: {
        balanceInStock: true,
      },
    });

    const itemDetails = await prisma.item.findMany({
      where: {
        id: {
          in: stockByType.map(item => item.itemId),
        },
      },
    });

    const totalStock = stockByType.reduce((sum, item) => sum + (item._sum.balanceInStock || 0), 0);

    const stockPercentageByType = stockByType.map((item) => {
      const itemDetail = itemDetails.find(detail => detail.id === item.itemId);
      return {
        itemId: item.itemId,
        itemName: itemDetail?.name, // Accessing item details
        balanceInStock: item._sum.balanceInStock || 0,
        percentage: calculatePercentage(item._sum.balanceInStock || 0, totalStock),
      };
    });
    

    const totalInseminations = await prisma.insemination.count({
      where: { farm: { id: farmId } }
    });
    const inseminationByType = await prisma.insemination.groupBy({
      by: ['type'],
      where: { farm: { id: farmId } },
      _count: {
        _all: true
      }
    });

    const inseminationPercentageByType = inseminationByType.map(item => ({
      type: item.type,
      count: item._count._all || 0,
      percentage: calculatePercentage(item._count._all || 0, totalInseminations)
    }));
  
    const totalVaccinations = await prisma.vaccination.count({
      where: { farm: { id: farmId } }
    });
    const vaccinationByType = await prisma.vaccination.groupBy({
      by: ['vaccineType'],
      where: { farm: { id: farmId } },
      _count: {
        _all: true
      }
    });

    const vaccinationPercentageByType = vaccinationByType.map(item => ({
      vaccineType: item.vaccineType,
      count: item._count._all || 0,
      percentage: calculatePercentage(item._count._all || 0, totalVaccinations)
    }));

    const report = {
      cattle: {
        total: cattleCount,
        healthy: {
          count: healthyCattleCount,
          percentage: healthyCattlePercentage
        },
        sick: {
          count: sickCattleCount,
          percentage: sickCattlePercentage
        },
        sold: {
          count: soldCattleCount,
          percentage: soldCattlePercentage
        },
        processed: {
          count: processedCount,
          percentage: processedCattleParcentage
        }
      },
      production: {
        totalQuantity: totalProductionQuantity,
        byProduct: productionPercentageByType
      },
      stock: {
        totalQuantity: totalStock,
        byType: stockPercentageByType
      },
      insemination: {
        total: totalInseminations,
        byType: inseminationPercentageByType
      },
      vaccination: {
        total: totalVaccinations,
        byVaccineType: vaccinationPercentageByType
      }
    };


    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error generating statistics report:', error);
    res.status(500).json({ success: false, message: 'Failed to generate statistics report' });
  }
};