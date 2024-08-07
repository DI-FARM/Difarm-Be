import Joi from 'joi';

const newProdInfoSchema = Joi.object({
    productType: Joi.string().valid('MILK','MEAT').required(),
    totalQuantity: Joi.number().greater(0).required(),
    pricePerunit: Joi.number().greater(0).required(),
});
const updatenewProdInfoSchame = Joi.object({
    productType: Joi.string().valid('MILK','MEAT'),
    totalQuantity: Joi.number().greater(0),
    pricePerunit: Joi.number().greater(0),
});

export default {newProdInfoSchema, updatenewProdInfoSchame};
