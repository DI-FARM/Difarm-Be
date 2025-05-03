import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().required().messages({ "any.required": "Category name is required" }),
  unit: Joi.string().required().messages({ "any.required": "Category unit is required" })
});

export const updateCategorySchema = Joi.object({
  name: Joi.string(),
  unit: Joi.string()
}).min(1);