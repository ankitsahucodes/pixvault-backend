const { initializeDatabase } = require("./db/db.connect.js");
initializeDatabase();

const cors = require("cors");
const express = require("express");
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const { verifyUser } = require("./middleware/auth.middleware.js");

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Auth routes
const authRoutes = require("./routes/auth.routes.js");
app.use("/auth", authRoutes);

// Image routes
const imageRoutes = require("./routes/image.routes.js");
app.use("/", verifyUser, imageRoutes);

// Album routes
const albumRoutes = require("./routes/album.routes");
app.use("/albums", verifyUser, albumRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
