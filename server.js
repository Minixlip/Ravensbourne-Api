require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/Users');
const dashboardRoutes = require('./routes/Dashboard');
const paymentRoutes = require('./routes/Payment');
const cardRoutes = require('./routes/Card');
// PORT
const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

//express app
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// cors
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

//routes
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/card', cardRoutes);

// connect to db
mongoose
  .connect(mongoURI)
  .then(() => {
    // listen for requests
    app.listen(port, () => {
      console.log('Connected to DB & listening on port:', port);
    });
  })
  .catch((error) => {
    console.log(error);
  });
