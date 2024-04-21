const Joi = require("joi");

function ValidateCreateCabinet(obj) {
  const schema = Joi.object({
    cabinet_name: Joi.string().trim().min(3).required(),
    cabinet_address_coordinates: Joi.string().trim().required(),
    cabinet_address_city: Joi.string().trim().required(),
    cabinet_address_country: Joi.string().trim().required(),
    cabinet_address_longitude: Joi.number().required(),
    cabinet_images: Joi.array().items(
      Joi.object({
        type: Joi.string().required(),
      })
    ),
  });
  return schema.validate(obj);
}
function ValidateUpdateCabinet(obj) {
  const schema = Joi.object({
    cabinet_name: Joi.string().trim().min(3),
    cabinet_address_coordinates: Joi.string().trim(),
    cabinet_address_city: Joi.string().trim(),
    cabinet_address_country: Joi.string().trim(),
    cabinet_address_longitude: Joi.number(),
    cabinet_images: Joi.array().items(Joi.string()),
  });
  return schema.validate(obj);
}

module.exports = {
  ValidateCreateCabinet,
  ValidateUpdateCabinet,
};
