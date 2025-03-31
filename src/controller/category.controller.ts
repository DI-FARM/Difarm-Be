import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../service/category.service";
import { createCategorySchema, updateCategorySchema } from "../validation/category.validation";

export const CategoryController = {
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = createCategorySchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const newCategory = await CategoryService.createCategory(value);
      return res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  },

  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = updateCategorySchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const updatedCategory = await CategoryService.updateCategory(req.params.id, value);
      return res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
