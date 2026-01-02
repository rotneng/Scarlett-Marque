const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const productRoute = require("./Route/productRoute");
const messageRoute = require("./Route/messageRoute");
const userRoute = require("./Route/userRoute");
const cartRoutes = require("./Route/cartRoutes");
const addressRoute = require("./Route/addressRoutes");
const orderRoutes = require("./Route/orderRoute");

const app = express();
const port = process.env.PORT || 3000;

// --- CHANGE 1: Trust the Proxy (Required for Render + Cookies) ---
app.set("trust proxy", 1); 

// --- CHANGE 2: Relax Helmet for Cross-Origin (Vercel) ---
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allows Vercel to fetch data/images
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000", "https://scarlett-marque.vercel.app"],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/product", productRoute);
app.use("/messages", messageRoute);
app.use("/user", userRoute);
app.use("/cart", cartRoutes);
app.use("/address", addressRoute);
app.use("/order", orderRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});