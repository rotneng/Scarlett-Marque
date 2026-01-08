const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const productRoute = require("./Route/productRoute");
const messageRoute = require("./Route/messageRoute");
const userRoute = require("./Route/userRoute");
const cartRoutes = require("./Route/cartRoutes");
const addressRoute = require("./Route/addressRoutes");
const orderRoutes = require("./Route/orderRoute");

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: "https://scarlett-marque.vercel.app || http://localhost:3000",
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use("/public", express.static(path.join(__dirname, "uploads")));

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
