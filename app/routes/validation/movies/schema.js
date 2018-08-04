const Joi = require('joi');

module.exports = {
    postMovies: Joi.object().keys({
        //.regex(/^[a-z0-9]+$/i) is not working ? 
        title: Joi.string().max(100).trim().min(1).required()
    }),
    getMovies: Joi.object().keys({
        title: Joi.string().max(100).trim().min(1)
    })
}