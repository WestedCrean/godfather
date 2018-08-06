const Joi = require('joi');

module.exports = {
    postSchema: Joi.object().keys({
        title: Joi.string().max(100).trim().min(1).required()
    }),
    getSchema: Joi.object().keys({
        sort:  Joi.string().trim().regex(/byyear|bycountry|byrating|byboxoffice/gm),   
        filter: Joi.string().trim().regex(/[a-z]+=[a-zA-Z0-9]+/)
    }),
    getSchemaWithFilter: Joi.object().keys({
        filter: Joi.string().trim().regex(/[a-z]+=[a-zA-Z0-9]+/),
        sort:  Joi.string().trim().regex(/byyear|bycountry|byrating|byboxoffice/gm)   
    })
}