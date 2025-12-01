const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const productRoute = require("./Route/productRoute");
const messageRoute = require("./Route/messageRoute");
const userRoute = require("./Route/userRoute");
const app = express();
const port = 3000;

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/product", productRoute);
app.use("/messages", messageRoute);
app.use("/user", userRoute);

mongoose
  .connect(
    "mongodb+srv://rotneng:Rotnen1010@firstproject.rib4hhv.mongodb.net/",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log("error connecting to database", err);
  });

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
