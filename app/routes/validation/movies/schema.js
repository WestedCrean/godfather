const Joi = require('joi');

module.exports = {
    postSchema: Joi.object().keys({
        //.regex(/^[a-z0-9]+$/i) is not working ? 
        title: Joi.string().max(100).trim().min(1).required()
    }),
    getSchema: Joi.object().keys({
        title: Joi.string().max(100).trim().min(1)
    })
}