import { Request, Response, NextFunction } from "express";
import { SupplierService } from "../service/supplier.service";
import { createSupplierSchema, updateSupplierSchema } from "../validation/supplier.validation";

export const SupplierController = {
  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = createSupplierSchema.validate(req.body, { abortEarly: false });
      if (error) return res.status(400).json({ errors: error.details.map(err => err.message) });
      
      const newSupplier = await SupplierService.createSupplier(value);
      return res.status(201).json(newSupplier);
    } catch (error) {
      next(error);
    }
  },

  async getAllSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = await SupplierService.getAllSuppliers();
      return res.status(200).json(suppliers);
    } catch (error) {
      next(error);
    }
  },

  async getSuppliersByFarm(req: Request, res: Response, next: NextFunction) {
    try {
      const { farmId } = req.params;
      if (!farmId) return res.status(400).json({ message: "Farm ID is required" });

      const suppliers = await SupplierService.getSuppliersByFarmId(farmId);
      return res.status(200).json(suppliers);
    } catch (error) {
      next(error);
    }
  },

  async getSupplierById(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await SupplierService.getSupplierById(req.params.id);
      return res.status(200).json(supplier);
    } catch (error) {
      next(error);
    }
  },

  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = updateSupplierSchema.validate(req.body, { abortEarly: false });
      if (error) return res.status(400).json({ errors: error.details.map(err => err.message) });

      const updatedSupplier = await SupplierService.updateSupplier(req.params.id, value);
      return res.status(200).json(updatedSupplier);
    } catch (error) {
      next(error);
    }
  },

  async deleteSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      await SupplierService.deleteSupplier(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
