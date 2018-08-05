const Joi = require('joi');

module.exports = {
    postSchema: Joi.object().keys({
        title: Joi.string().max(100).trim().min(1).required()
    }),
    getSchema: Joi.object().keys({
        params:  Joi.string().trim().regex(/byyear|bycountry|byrating|byboxoffice/gm)   
    })
}