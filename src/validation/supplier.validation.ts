import Joi from "joi";

export const createSupplierSchema = Joi.object({
  name: Joi.string().trim().min(2).required().messages({
    "string.empty": "Supplier name cannot be empty",
    "string.min": "Supplier name must be at least 2 characters",
    "any.required": "Supplier name is required"
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Invalid email format"
  }),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().messages({
    "string.pattern.base": "Phone number must be between 10-15 digits"
  }),
  TIN: Joi.string().optional(),
  // farmId: Joi.string().uuid().required().messages({
  //   "any.required": "Farm ID is required",
  //   "string.uuid": "Invalid farm ID format"
  // })
});

export const updateSupplierSchema = Joi.object({
  name: Joi.string().trim().min(2),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  TIN: Joi.string()
}).min(1).messages({
  "object.min": "At least one field must be updated"
});