const User = require('../models/user.model.js');
const ClassSchedule = require('../models/schedule.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginTrainer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const trainer = await User.findOne({ email, role: 'trainer' });
    if (!trainer) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, trainer.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: trainer._id, role: trainer.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      trainer: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        role: trainer.role,
        phone: trainer.phone,
        address: trainer.address
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.viewTrainerSchedule = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' }); 
    console.log(today);
  
    const schedules = await ClassSchedule.find({
      trainer: trainerId,
      date: new Date(today)
    })
      .populate('trainees', 'name')
      .sort({ startTime: 1 });

    const calendar = [];

    schedules.forEach(schedule => {
      const { startTime, endTime, trainees } = schedule;

      calendar.push({
        startTime,
        endTime,
        trainees: trainees.map(t => t.name)
      });
    });

    res.json({ date: today, schedule: calendar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};
