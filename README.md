# Gym Class Scheduling and Membership Management System

## Project Overview
This project is a role-based gym management system designed to streamline daily operations, class scheduling, and user management in a gym environment. It supports three user roles — Admin, Trainer, and Trainee — each with specific capabilities:
- **Admins can register trainers, create class schedules (max 5 per day), and assign trainers to classes**
- **Trainers can view their assigned class schedules but cannot create or modify them**
- **Trainees can register, log in, book available classes (max 10 trainees per class), and cancel their bookings if needed.**


## Technologies Used
- **Programming Language:** JavaScript (Node.js)
- **Backend Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Time Zone Handling:** Moment.js with moment-timezone
- **Architecture Pattern:** MVC (Model-View-Controller)
- **Development Tools:** Visual Studio Code, Postman
- **API Testing:** Postman
- **Environment Config:** dotenv

## API Endpoints
**Auth & Registration**
- **POST      -       /registerTrainer      -        Create class schedule (admin)**
- **POST      -       /registerTrainee      -         Book a schedule (trainee)**
- **POST      -       /loginTrainee         -            View trainer schedule**
- **POST      -       /loginTrainer         -         View trainee today's bookings**
- **POST      -       /logoutTrainer        -             Cancel trainee booking**

**Scheduling & Booking**
- **POST	    -         /createSchedule	    -    Create class schedule (admin)**
- **POST	    -         /book/:scheduleId	  -      Book a schedule (trainee)**
- **GET	      -         /viewSchedule	      -         View trainer schedule**
- **GET	      -         /my-today-schedules	-    View trainee today's bookings**
- **DELETE	  -      cancelSchedule/:scheduleId  -    Cancel trainee booking**

## Database Schema
- **users**
{
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'trainer', 'trainee'] },
  phone,
  address,
  timestamps
}
- **classschedules**
{
  date: Date,
  startTime: String,  // format: 'HH:mm'
  endTime: String,    // format: 'HH:mm'
  trainer: ObjectId,  // ref to User
  trainees: [ObjectId] // ref to Users
}

## Admin Credentials
Email: admin@gmail.com  
Password: 123456
Role: admin

## Instructions to Run Locally
- npm init -y
- npm install
- npm i express nodemon dotenv jsonwebtoken
- **Create env file:**
- PORT=3000
- JWT_SECRET=your_jwt_secret
- MONGODB_URI=mongodb://localhost:27017/gymManagement
- **Start the Server:**
- npm start
## Postman documentation:
- https://documenter.getpostman.com/view/40176177/2sB2xBDqBH








