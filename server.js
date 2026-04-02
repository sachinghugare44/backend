const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://adminSachin:Sachin12345@sachprojects.bq6dfit.mongodb.net/myDB?retryWrites=true&w=majority")
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));