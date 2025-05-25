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
