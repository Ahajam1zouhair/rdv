const asyncHandler = require("express-async-handler");
const Schedule = require("../models/scheduleModel");

// @desc    Créer un emploi du temps pour un médecin
// @route   POST /api/doctor/schedule
// @access  Privé
const createSchedule = asyncHandler(async (req, res) => {
  const { day, morning, evening } = req.body;

  const schedule = new Schedule({
    doctorId: req.doctor.id,
    day,
    morning,
    evening,
  });

  await schedule.save();

  res.status(201).json({
    schedule,
  });
});

// @desc    Retourner un emploi du temps pour un médecin
// @route   GET /api/doctor/schedule/:id
// @access  Private
const getSchedule = asyncHandler(async (req, res) => {
  try {
    const schedule = await Schedule.find({ doctorId: req.params.id });
    if (schedule.length === 0) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
// @desc    Retourner un emploi du temps pour un médecin (Return a schedule for a doctor)
// @route   GET /api/doctor/schedule/:id
// @access  Private

const getSchedulebyday = asyncHandler(async (req, res) => {
  try {
    const schedule = await Schedule.find({
      doctorId: req.params.id,
      day: req.params.day,
    });
    if (schedule.length === 0) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// @desc    Mettre à jour un emploi du temps pour un médecin
// @route   PUT /api/doctor/schedule/:id
// @access  Privé
const updateSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);
  if (!schedule) {
    return res.status(404).json({ error: "Schedule not found" });
  } else if (schedule.doctorId.toString() !== req.doctor.id) {
    return res.status(401).json({
      error: "You are not authorized to update this schedule",
    });
  } else {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedSchedule);
  }
});

module.exports = {
  createSchedule,
  getSchedule,
  getSchedulebyday,
  updateSchedule,
};
