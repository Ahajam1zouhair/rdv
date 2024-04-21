const asyncHandler = require("express-async-handler");
const Cabinet = require("../models/cabinetModel");
const {
  ValidateCreateCabinet,
  ValidateUpdateCabinet,
} = require("../requests/cabinetRequset");

// @desc     create Cabinet  Doctor
// @route   POST /api/doctor/cabinet
// @access  Private
const createCabinet = asyncHandler(async (req, res) => {
  const { error } = ValidateCreateCabinet(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const {
    cabinet_name,
    cabinet_address_coordinates,
    cabinet_address_city,
    cabinet_address_country,
    cabinet_address_longitude,
    cabinet_images,
  } = req.body;
  console.log(req.doctor);
  const cabinet = new Cabinet({
    doctor_id: req.doctor.id,
    cabinet_name,
    cabinet_address_coordinates,
    cabinet_address_city,
    cabinet_address_country,
    cabinet_address_longitude,
    cabinet_images,
  });
  await cabinet.save();
  res.status(201).json({
    cabinet_name,
    cabinet_address_coordinates,
    cabinet_address_city,
    cabinet_address_country,
    cabinet_address_longitude,
    cabinet_images,
  });
});

// @desc    update Cabinet Doctor
// @route   PUT /api/doctor/cabinet/:id
// @access  Private
const updateCabinet = asyncHandler(async (req, res) => {
  const { error } = ValidateUpdateCabinet(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const cabinet = await Cabinet.findById(req.params.id);
  if (!cabinet) {
    return res.status(404).json({ error: "Cabinet not found" });
  } else if (cabinet.doctor_id.toString() !== req.doctor.id) {
    console.log(req.doctor.id);
    return res.status(401).json({
      error: "You are not allowed , you only can update your cabin",
    });
  } else {
    const updateCabinet = await Cabinet.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updateCabinet);
  }
});

// @desc    get Cabinet Doctor
// @route   GET /api/doctor/cabinet/:id
// @access  Private
const getByIdCabinet = asyncHandler(async (req, res) => {
  const cabinets = await Cabinet.find();
  const filteredCabinets = cabinets.filter(
    (cabinet) => cabinet.doctor_id.toString() === req.params.id
  );

  if (filteredCabinets.length === 0) {
    return res.status(404).json({ error: "Cabinet not found" });
  } else {
    res.status(200).json(filteredCabinets);
  }
});

module.exports = {
  createCabinet,
  updateCabinet,
  getByIdCabinet,
};
