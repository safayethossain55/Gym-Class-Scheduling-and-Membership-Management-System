const express = require("express");
const router = express.Router();

const {
    registerTrainee,
    loginTrainee,
    bookClass,
    viewTodayBookings,
    cancelBooking,
    logoutTrainee, 
    updateTraineeProfile
} = require("../controllers/trainee.controller");

const auth = require("../middlewares/auth.middleware.js");
const allowRoles = require("../middlewares/role.middleware.js");


router.post("/registerTrainee", registerTrainee);
router.post("/loginTrainee", loginTrainee);

router.post('/book/:scheduleId', auth, allowRoles(['trainee']), bookClass);
router.get('/my-today-schedules', auth, allowRoles(['trainee']), viewTodayBookings);
router.delete('/cancelSchedule/:scheduleId', auth, allowRoles(['trainee']), cancelBooking);
router.post("/logoutTrainee", auth, allowRoles(['trainee']), logoutTrainee);
router.post("/updateTrainee", auth, allowRoles(['trainee']), updateTraineeProfile);

module.exports = router;
