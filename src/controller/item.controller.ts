import { Request, Response, NextFunction } from "express";
import { ItemService } from "../service/item.service";
import { createItemSchema, updateItemSchema } from "../validation/items.validation";
import ResponseHandler from "../util/responseHandler";
import { StatusCodes } from "http-status-codes";

const responseHandler = new ResponseHandler();

export const ItemController = {
  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = createItemSchema.validate(req.body);

      const { farmId } = req.params;

      value.farmId = farmId;
      
      if (error) return res.status(400).json({ error: error.details[0].message });

      const newItem = await ItemService.createItem(value);
      responseHandler.setSuccess(StatusCodes.OK, 'Item created successfully', newItem);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  },
  


  async getAllItems(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await ItemService.getAllItems();
      responseHandler.setSuccess(StatusCodes.OK, 'Items retrieves successfully', items);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  },

  async getItemsByFarm(req: Request, res: Response, next: NextFunction) {
      try {
          const { farmId } = req.params;
  
          if (!farmId) {
              return res.status(400).json({ message: "farmId is required" });
          }
  
          const items = await ItemService.getItemByFarmId(farmId);
          responseHandler.setSuccess(StatusCodes.OK, 'Items by farm retrieved successfully', items);
          return responseHandler.send(res);
          
      } catch (error) {
          next(error);
      }
  },

  async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ItemService.getItemById(req.params.id);
      responseHandler.setSuccess(StatusCodes.OK, 'Item by ID retrieved successfully', item);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  },

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = updateItemSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const updatedItem = await ItemService.updateItem(req.params.id, value);
      responseHandler.setSuccess(StatusCodes.OK, 'Item updated successfully', updatedItem);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  },

  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ItemService.deleteItem(req.params.id);
      responseHandler.setSuccess(StatusCodes.OK, 'Item deleted successfully', result);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  }
};
