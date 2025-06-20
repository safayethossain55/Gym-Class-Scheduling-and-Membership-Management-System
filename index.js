require('dotenv').config();
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const app = express();

const admin = require("./routes/admin.routes");
const trainee = require("./routes/trainee.routes");
const trainer = require("./routes/trainer.routes");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(admin);
app.use(trainee);
app.use(trainer);

app.get('/', (req, res) => {
  res.send("Gym Scheduling System API");
});

const connectDB = async() =>{
    try {
        await mongoose.connect("mongodb://localhost:27017/gymManagement");
        console.log("DB is connected");
    } catch (error) {
        console.log("DB is not connected");
        console.log(error.message);
        process.exit(1);
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, async() => {
  console.log(`Server running on port http://localhost:`+PORT);
  await connectDB();
});