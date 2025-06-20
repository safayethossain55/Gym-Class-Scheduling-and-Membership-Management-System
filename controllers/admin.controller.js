const momentTz = require('moment-timezone');
const User = require('../models/user.model.js');
const ClassSchedule = require('../models/schedule.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerTrainer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Trainer already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const trainer = new User({
      name,
      email,
      password: hashedPassword,
      role: 'trainer',
    });

    await trainer.save();

    res.status(201).json({ message: trainer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { startTime, endTime, trainerEmail } = req.body;

    if (!trainerEmail || !startTime || !endTime) {
      return res.status(400).json({ message: 'Trainer email, start time, and end time are required' });
    }

    const trainer = await User.findOne({ email: trainerEmail, role: 'trainer' });
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found or not authorized' });
    }


    const dhakaNow = momentTz().tz('Asia/Dhaka');
    const normalizedDate = new Date(Date.UTC(dhakaNow.year(), dhakaNow.month(), dhakaNow.date()));

    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const start = toMinutes(startTime);
    const end = toMinutes(endTime);

    if (end - start !== 120) {
      return res.status(400).json({ message: 'Class must be exactly 2 hours long' });
    }

    const todaysSchedules = await ClassSchedule.find({
      trainer: trainer._id,
      date: normalizedDate
    });

    if (todaysSchedules.length >= 5) {
      return res.status(400).json({ message: 'Cannot create more than 5 schedules per day for this trainer' });
    }

    const conflict = todaysSchedules.some(sch => {
      const existingStart = toMinutes(sch.startTime);
      const existingEnd = toMinutes(sch.endTime);
      return !(end <= existingStart || start >= existingEnd); 
    });

    if (conflict) {
      return res.status(409).json({ message: 'Schedule conflict detected for this trainer' });
    }

    const newSchedule = new ClassSchedule({
      date: normalizedDate,
      startTime,
      endTime,
      trainer: trainer._id,
      trainees: []
    });

    await newSchedule.save();

    res.status(201).json({
      message: 'Schedule created successfully',
      schedule: newSchedule
    });

  } catch (error) {
    console.error('Error in createSchedule:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
