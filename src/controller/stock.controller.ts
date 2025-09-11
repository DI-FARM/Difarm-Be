import { Request, Response, NextFunction } from "express";
import { StockService } from "../service/stock.service";
import { stockInSchema, stockOutSchema } from "../validation/stock.validation";

export const StockController = {
  async addStockIn(req: Request, res: Response, next: NextFunction) {
    try {

      const user = (req as any).user.data;
      
      const { error, value } = stockInSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const newStockIn = await StockService.addStockIn(value, user);
      return res.status(201).json(newStockIn);
    } catch (error) {
      next(error);
    }
  },

  async getStockIn(req: Request, res: Response, next: NextFunction) {
    try {
      const stockInRecords = await StockService.getStockIn();
      return res.status(200).json(stockInRecords);
    } catch (error) {
      next(error);
    }
  },

  async addStockOut(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = stockOutSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const newStockOut = await StockService.addStockOut(value);
      return res.status(201).json(newStockOut);
    } catch (error) {
      next(error);
    }
  },

  async getStockOut(req: Request, res: Response, next: NextFunction) {
    try {
      const stockOutRecords = await StockService.getStockOut();
      return res.status(200).json(stockOutRecords);
    } catch (error) {
      next(error);
    }
  }
};

// Get total available stock items
export const getTotalStockItems = async (req: Request, res: Response) => {
  const { farmId } = req.params;
  const responseHandler = new ResponseHandler();
  
  try {
    const stocks = await prisma.stock.findMany({
      where: { farmId }
    });

    const totalItems = stocks.reduce((sum, stock) => sum + stock.quantity, 0);

    responseHandler.setSuccess(
      StatusCodes.OK,
      "Total stock items fetched successfully",
      {
        farmId,
        totalItems,
        stockTypes: stocks.length
      }
    );
  } catch (error) {
    console.error(error);
    responseHandler.setError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error fetching total stock items"
    );
  } finally {
    return responseHandler.send(res);
  }
};

// Get value of available stock items
export const getStockValue = async (req: Request, res: Response) => {
  const { farmId } = req.params;
  const responseHandler = new ResponseHandler();
  
  try {
    const stocks = await prisma.stock.findMany({
      where: { farmId },
      include: {
        transactions: true
      }
    });

    let totalValue = 0;
    const stockDetails = stocks.map(stock => {
      // Calculate value based on ADDITION transactions (purchases)
      const additionTransactions = stock.transactions.filter(t => t.type === 'ADDITION');
      const stockValue = additionTransactions.reduce((sum, transaction) => {
        // Assuming you have a price/cost field in transactions or calculate average cost
        return sum + (transaction.quantity * 1); // Replace 1 with actual unit cost if available
      }, 0);
      
      totalValue += stockValue;
      
      return {
        id: stock.id,
        name: stock.name,
        quantity: stock.quantity,
        type: stock.type,
        value: stockValue
      };
    });

    responseHandler.setSuccess(
      StatusCodes.OK,
      "Stock value fetched successfully",
      {
        farmId,
        totalValue,
        stockDetails
      }
    );
  } catch (error) {
    responseHandler.setError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error fetching stock value"
    );
  } finally {
    return responseHandler.send(res);
  }
};