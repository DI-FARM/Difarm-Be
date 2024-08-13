import Joi from 'joi';

const stockSchema = Joi.object({
    name: Joi.string().min(3).trim().required(),
    quantity: Joi.number().greater(0).required(),
    type: Joi.string().valid('FOOD','MEDICATION','CONSTRUCTION','WATER','FEED_ACCESSORIES','HYGIENE_MATERIALS'),
});

const validateStock = (payload: any) => stockSchema.validate(payload, { abortEarly: false });

export default validateStock;
