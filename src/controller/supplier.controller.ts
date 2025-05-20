import { Request, Response, NextFunction } from "express";
import { SupplierService } from "../service/supplier.service";
import { createSupplierSchema, updateSupplierSchema } from "../validation/supplier.validation";
import ResponseHandler from "../util/responseHandler";
import { StatusCodes } from "http-status-codes";

const responseHandler = new ResponseHandler();
export const SupplierController = {

  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = createSupplierSchema.validate(req.body, { abortEarly: false });
      if (error) return res.status(400).json({ errors: error.details.map(err => err.message) });
      const newSupplier = await SupplierService.createSupplier({...value,farmId: req.params.farmId});
      responseHandler.setSuccess(StatusCodes.CREATED, 'Supplier created successfully', newSupplier);
      return responseHandler.send(res);
          } catch (error) {
      next(error);
    }
  },

  async getAllSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = await SupplierService.getAllSuppliers();
      responseHandler.setSuccess(StatusCodes.OK, 'Supplier fetched successfully', suppliers);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  },

  async getSuppliersByFarm(req: Request, res: Response, next: NextFunction) {
    try {
      const { farmId } = req.params;
      if (!farmId) return res.status(400).json({ message: "Farm ID is required" });

      const suppliers = await SupplierService.getSuppliersByFarmId(farmId);
      responseHandler.setSuccess(StatusCodes.OK, 'Suppliers by farm fetched successfully', suppliers);
      return responseHandler.send(res);
        } catch (error) {
      next(error);
    }
  },

  async getSupplierById(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await SupplierService.getSupplierById(req.params.id);
      responseHandler.setSuccess(StatusCodes.OK, 'Supplier fetched successfully', supplier);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  },

  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = updateSupplierSchema.validate(req.body, { abortEarly: false });
      if (error) return res.status(400).json({ errors: error.details.map(err => err.message) });

      const updatedSupplier = await SupplierService.updateSupplier(req.params.id, value);
      responseHandler.setSuccess(StatusCodes.OK, 'Suppliers updated successfully', updatedSupplier);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  },

  async deleteSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedSupplier  = await SupplierService.deleteSupplier(req.params.id);
      responseHandler.setSuccess(StatusCodes.OK, 'Supplier removed successfully', deletedSupplier);
      return responseHandler.send(res);
    } catch (error) {
      next(error);
    }
  }
};
