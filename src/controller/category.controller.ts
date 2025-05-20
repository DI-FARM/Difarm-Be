import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../service/category.service";
import { createCategorySchema, updateCategorySchema } from "../validation/category.validation";
import { StatusCodes } from "http-status-codes";
import ResponseHandler from "../util/responseHandler";

const responseHandler = new ResponseHandler();
export const CategoryController = {
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = createCategorySchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const newCategory = await CategoryService.createCategory(value);
      responseHandler.setSuccess(StatusCodes.OK, 'Category created successfully', newCategory);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  },

  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAllCategories();
      responseHandler.setSuccess(StatusCodes.OK, 'Category retrieved successfully', categories);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  },

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      responseHandler.setSuccess(StatusCodes.OK, 'Category by id retrieved successfully', category);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = updateCategorySchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const updatedCategory = await CategoryService.updateCategory(req.params.id, value);
      responseHandler.setSuccess(StatusCodes.OK, 'Category updated successfully', updatedCategory);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.deleteCategory(req.params.id);
      responseHandler.setSuccess(StatusCodes.OK, 'Category deleted successfully', result);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  }
};
