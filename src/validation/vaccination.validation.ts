import Joi from 'joi';

const vaccinationSchema = Joi.object({
    cattleId: Joi.string().required(),
    date: Joi.date().required(),
    vaccineType: Joi.string().required(),
    price: Joi.number().positive().required(),
    vetId: Joi.string().required(),
    farmId: Joi.string().required(),
});

const validateFarm = (payload: any) => vaccinationSchema.validate(payload, { abortEarly: false });

export default validateFarm;