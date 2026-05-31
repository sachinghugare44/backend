
const express = require('express');
const attendanceRoutes = require('./src/routes/attendance');
const userRoutes = require('./src/routes/user');
const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://adminSachin:Sachin12345@sachprojects.bq6dfit.mongodb.net/myDB?retryWrites=true&w=majority")
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});