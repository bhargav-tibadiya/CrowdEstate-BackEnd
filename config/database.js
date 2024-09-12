// --> Importing All Dependancy <--
const mongoose = require('mongoose');


// --> Setting Up the Environment Variables <--
require(('dotenv')).config()


exports.connectDB = () => {
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Database Connection Successful"))
    .catch((error) => {
      console.log("DataBase Connection Failed. \nCheck Database.js File #BE001 ");
      console.error(error);
      process.exit(1);
    })
}
