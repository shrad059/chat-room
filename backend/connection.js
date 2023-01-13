const mongoose= require('mongoose');
require('dotenv').config();

mongoose.connect(
  `mongodb+srv://admin:admin@cluster0.7la3gm6.mongodb.net/chatAppMern?retryWrites=true&w=majority`, ()=>{
      console.log("connected to mongodb")
  }
);