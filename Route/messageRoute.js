const express = require("express");

const {
  addMessage,
  getMessages,
  deleteMessages,
} = require("../Controller/messageController");

const router = express.Router();

router.post("/addMessage", addMessage);
router.get("/getMessages", getMessages);
router.delete("/deleteMessages/:id", deleteMessages);

module.exports = router;
