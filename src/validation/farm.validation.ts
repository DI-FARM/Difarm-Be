import Joi from 'joi';

const farmSchema = Joi.object({
    name: Joi.string().min(3).required(),
    location: Joi.string().min(3).required(),
    size: Joi.number().positive().required()
});

const validateFarm = (payload: any) => farmSchema.validate(payload, { abortEarly: false });

export default validateFarm;
