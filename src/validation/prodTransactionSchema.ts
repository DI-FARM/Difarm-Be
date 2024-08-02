import Joi from 'joi';

const newTransactionSchame = Joi.object({
    productType: Joi.string().valid('MILK','MEAT').required(),
    quantity: Joi.number().greater(0).required(),
    date: Joi.date().iso().required(),
    consumer: Joi.string().required()
});
const updateTransactionSchame = Joi.object({
    productType: Joi.string().valid('MILK','MEAT'),
    quantity: Joi.number().greater(0),
    date: Joi.date().iso(),
    consumer: Joi.string()
});

export default {newTransactionSchame, updateTransactionSchame};
