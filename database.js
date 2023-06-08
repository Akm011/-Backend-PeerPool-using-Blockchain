const mongoose = require('mongoose');

// connection string
const mongoURI = "mongodb://127.0.0.1:27017/peerpool?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1";

const connectToMongoose = () => {
  try{
    mongoose.connect(mongoURI, () => {
        console.log("connected to mongoose successfully");
    })

  }catch(err){
    console.log(err)
  }
}

module.exports = connectToMongoose;