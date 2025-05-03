import Joi from "joi";

export const stockInSchema = Joi.object({
  itemId: Joi.string().required().messages({ "any.required": "Item ID is required" }),
  quantity: Joi.number().positive().required().messages({ "any.required": "Quantity is required", "number.positive": "Quantity must be a positive number" }),
  supplierId: Joi.string().optional(),
  quarter: Joi.string().optional(),
  totalPrice: Joi.number().positive().optional(),
  specification: Joi.string().optional(),
  receiveDate: Joi.date().default(() => new Date())
});

export const stockOutSchema = Joi.object({
  itemId: Joi.string().required().messages({ "any.required": "Item ID is required" }),
  quantity: Joi.number().positive().required().messages({ "any.required": "Quantity is required", "number.positive": "Quantity must be a positive number" }),
  farmId: Joi.string().required().messages({ "any.required": "Farm ID is required" }),
  receiveDate: Joi.date().default(() => new Date())
});
