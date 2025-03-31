import { Request, Response, NextFunction } from "express";
import { ItemService } from "../service/item.service";
import { createItemSchema, updateItemSchema } from "../validation/items.validation";

export const ItemController = {
  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = createItemSchema.validate(req.body);

      const { farmId } = req.params;

      value.farmId = farmId;
      
      if (error) return res.status(400).json({ error: error.details[0].message });

      const newItem = await ItemService.createItem(value);
      return res.status(201).json(newItem);
    } catch (error) {
      next(error);
    }
  },
  

  async getAllItems(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await ItemService.getAllItems();
      return res.status(200).json(items);
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
  
          return res.status(200).json(items);
          
      } catch (error) {
          next(error);
      }
  },

  async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ItemService.getItemById(req.params.id);
      return res.status(200).json(item);
    } catch (error) {
      next(error);
    }
  },

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = updateItemSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const updatedItem = await ItemService.updateItem(req.params.id, value);
      return res.status(200).json(updatedItem);
    } catch (error) {
      next(error);
    }
  },

  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      await ItemService.deleteItem(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
