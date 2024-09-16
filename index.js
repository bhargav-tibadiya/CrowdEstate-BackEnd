// --> Importing All Dependancy <--
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// --> Import the required routers <--
const userRoutes = require("./routes/User");


// --> Setting Up the Environment Variables <--
require(('dotenv')).config()


// --> Import the required controllers and middleware functions <--
const database = require("./config/database");



// --> Creating Express App <--
const app = express();
const PORT = process.env.PORT || 4000;
const URL = process.env.FRONT_END_URL;


// --> database connect <--
database.connectDB();


// --> Applying All Middlewares <--
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: URL,
    credentials: true,
  })
)

// --> Applying Routes <--
app.use("/api/v1/auth", userRoutes);


// --> default route <--
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: 'Your server is up and running....'
  });
});


// --> Staring the Server <--
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`)
})


