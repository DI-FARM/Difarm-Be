import Joi from "joi";

const cattleSchema = Joi.object({
    tagNumber: Joi.string().min(3).trim().required(),
    breed: Joi.string().min(3).trim().required(),
    gender: Joi.string().valid('Bull', 'Cow', 'Other').required(),
    DOB: Joi.date().iso().required(),
    weight: Joi.number().positive().required(),
    location: Joi.string().min(3).trim().required(),
    farmId: Joi.string().uuid().required(),
    lastCheckupDate: Joi.date().iso().required(),
    // vaccineHistory: Joi.array().items(Joi.string().min(3).trim()),
    vaccineHistory: Joi.string().min(3).trim(),
    purchaseDate: Joi.date().iso().required(),
    price: Joi.number().positive().required(),
});
const cattleSummarySchema = Joi.object({
    year: Joi.number().positive().greater(1000),
});

const validateForm = (schema: Joi.ObjectSchema<any>) => (payload: any) => schema.validate(payload, { abortEarly: false });
const cattleValidation = validateForm(cattleSchema);
const cattleSummaryValidation = validateForm(cattleSummarySchema);

export default {cattleValidation, cattleSummaryValidation};
