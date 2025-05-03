import Joi from "joi";

export const createItemSchema = Joi.object({
  name: Joi.string().required().messages({ "any.required": "Name is required" }),
  unitPrice: Joi.number().positive().required().messages({ "any.required": "Unit Price is required" }),
  categoryId: Joi.string().uuid().required().messages({ "any.required": "Category ID is required" }),
  supplierId: Joi.string().uuid().required().messages({ "any.required": "Supplier ID is required" })
});

export const updateItemSchema = Joi.object({
  name: Joi.string(),
  unitPrice: Joi.number().positive(),
  categoryId: Joi.string().uuid(),
  supplierId: Joi.string().uuid(),
}).min(1); // Ensure at least one field is updated
