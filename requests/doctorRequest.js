const Joi = require("joi");

function ValidateCreateDocter(obj) {
  const schema = Joi.object({
    doctor_firstname: Joi.string().trim().min(3).required(),
    doctor_lastname: Joi.string().trim().min(3).required(),
    doctor_email: Joi.string().trim().email().required(),
    doctor_Date_of_Birth: Joi.string().trim().required(),
    doctor_password: Joi.string().trim().required(),
    doctor_specialty: Joi.string().trim().required(),
    doctor_phone: Joi.string().trim().min(3).required(),
    doctor_cin: Joi.string().trim().min(3).required(),
    doctor_profile: Joi.string().trim(),
    doctor_profile_description: Joi.string().trim(),
  });
  return schema.validate(obj);
}
function ValidateUpdateDocter(obj) {
  const schema = Joi.object({
    doctor_firstname: Joi.string().trim().min(3),
    doctor_lastname: Joi.string().trim().min(3),
    doctor_email: Joi.string().trim().email(),
    doctor_Date_of_Birth: Joi.string().trim(),
    doctor_password: Joi.string().trim(),
    doctor_specialty: Joi.string().trim(),
    doctor_phone: Joi.string().trim().min(3),
    doctor_cin: Joi.string().trim().min(3),
    doctor_profile: Joi.string().trim(),
    doctor_profile_description: Joi.string().trim(),
    doctor_certifications: Joi.array().items(
      Joi.object({
        certification_name: Joi.string().required(),
        certification_anne: Joi.string().required(),
      })
    ),
  });
  return schema.validate(obj);
}
function ValidateLoginDocter(obj) {
  const schema = Joi.object({
    doctor_email: Joi.string().trim().email().required(),
    doctor_password: Joi.string().trim().required(),
  });
  return schema.validate(obj);
}

module.exports = {
  ValidateCreateDocter,
  ValidateLoginDocter,
  ValidateUpdateDocter,
};
