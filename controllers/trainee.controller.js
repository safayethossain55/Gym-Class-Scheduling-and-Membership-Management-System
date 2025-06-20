const User = require('../models/user.model.js');
const ClassSchedule = require('../models/schedule.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const momentTz = require('moment-timezone');


exports.registerTrainee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingTrainee = await User.findOne({ email });
    if (existingTrainee) return res.status(400).json({ message: 'Trainee already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const trainee = new User({
      name,
      email,
      password: hashedPassword,
      role: 'trainee',
    });

    await trainee.save();

    res.status(201).json({ message: trainee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginTrainee = async (req, res) => {
  try {
    const { email, password } = req.body;

    const trainee = await User.findOne({ email, role: 'trainee' });
    if (!trainee) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, trainee.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: trainee._id, role: trainee.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      trainee: {
        id: trainee._id,
        name: trainee.name,
        email: trainee.email,
        role: trainee.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookClass = async (req, res) => {
  try {
    const traineeId = req.user.id;
    const { scheduleId } = req.params;

    const schedule = await ClassSchedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    if (schedule.trainees.includes(traineeId)) {
      return res.status(400).json({ message: 'You are already booked in this class' });
    }

    if (schedule.trainees.length >= 10) {
      return res.status(400).json({ message: 'Class is already full' });
    }

    const start = parseTime(schedule.startTime);
    const end = parseTime(schedule.endTime);

    const conflicting = await ClassSchedule.findOne({
      date: schedule.date,
      trainees: traineeId,
      $or: [
        { startTime: { $lt: schedule.endTime, $gte: schedule.startTime } },
        { endTime: { $gt: schedule.startTime, $lte: schedule.endTime } },
        { startTime: { $lte: schedule.startTime }, endTime: { $gte: schedule.endTime } }
      ]
    });

    if (conflicting) {
      return res.status(400).json({ message: 'You already booked a class at this time' });
    }

    schedule.trainees.push(traineeId);
    await schedule.save();

    res.status(200).json({ message: 'Class booked successfully', schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function parseTime(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

exports.viewTodayBookings = async (req, res) => {
  try {
    const traineeId = req.user.id;

    const today = momentTz().tz('Asia/Dhaka');
    const startOfDay = new Date(Date.UTC(today.year(), today.month(), today.date()));
    const endOfDay = new Date(startOfDay);

    endOfDay.setUTCHours(23, 59, 59, 999);
    console.log({ startOfDay, endOfDay, today });
    const classes = await ClassSchedule.find({
      trainees: traineeId,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate('trainer', 'name email')
      .sort({ startTime: 1 });

    res.status(200).json({
      total: classes.length,
      classes
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const traineeId = req.user.id;
    const scheduleId = req.params.scheduleId;

    // 1. Find the class schedule
    const schedule = await ClassSchedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Class schedule not found' });
    }

    // 2. Check if trainee is already booked
    const isBooked = schedule.trainees.includes(traineeId);
    if (!isBooked) {
      return res.status(400).json({ message: 'You are not booked for this class' });
    }

    // 3. Remove trainee from the list
    schedule.trainees = schedule.trainees.filter(id => id.toString() !== traineeId);

    await schedule.save();

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.logoutTrainee = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};