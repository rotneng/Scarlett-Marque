const Message = require("../Models/messageModel");

exports.addMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "name, email, and message are required" });
    }

    const newMessage = new Message({ name, email, subject, message });
    const savedMessage = await newMessage.save();

    res.status(200).json({
      message: "message sent",
      data: savedMessage,
    });
  } catch (error) {
    console.log("error in adding message", error);
    res.status(500).json({ message: "error sending message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.status(200).json({
      message: "messages retrieved",
      data: messages,
    });
  } catch (error) {
    console.log("error in getting messages");
    res
      .status(500)
      .json({ message: "error retrieving messages", error: error.message });
  }
};

exports.deleteMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findOneAndDelete({ _id: id });

    if (!deletedMessage) {
      return res.status(400).json({ message: "message not found" });
    } else {
      return res.status(200).json({ message: "message deleted succesfully" });
    }
  } catch (error) {
    console.log("error in deleting message");
    res.status(500).json({ message: "error deleting message", error });
  }
};
