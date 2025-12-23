const Order = require("../Models/orderModel");

const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid,
      paidAt,
      paymentResult,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const userId = req.user.userId || req.user._id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "User not authorized. Token missing userId." });
    }

    const order = new Order({
      orderItems,
      user: userId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: isPaid === true,
      paidAt: isPaid ? paidAt || Date.now() : null,
      paymentResult: paymentResult || null,
      orderStatus: "ordered",
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.log("Order Controller Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "firstName lastName email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.user) {
      if (req.user && req.user.role === "admin") {
        return res.json(order);
      }
      return res.status(404).json({ message: "Order owner no longer exists." });
    }

    const currentUserId = req.user.userId || req.user._id;

    if (!currentUserId) {
      return res
        .status(500)
        .json({ message: "Server Error: User ID missing from token." });
    }

    const isOwner = order.user._id.toString() === currentUserId.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Access denied. You do not own this order." });
    }

    res.json(order);
  } catch (error) {
    console.error("GetOrderById Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id || req.body.paymentResult?.id,
        status: req.body.status || req.body.paymentResult?.status,
        update_time:
          req.body.update_time || req.body.paymentResult?.update_time,
        email_address:
          req.body.email_address || req.body.paymentResult?.email_address,
        provider: "Paystack",
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const orders = await Order.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id firstName email role")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.body.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.body.type) {
      order.orderStatus = req.body.type;
    }

    if (req.body.type === "delivered") {
      order.orderStatus = "delivered";
    }

    await order.save();
    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userConfirmDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentUserId = req.user.userId || req.user._id;

    if (order.user.toString() !== currentUserId.toString()) {
      return res
        .status(403)
        .json({ message: "Access denied. You did not place this order." });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = "delivered";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("User Confirm Delivery Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const reportOrderIssue = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentUserId = req.user.userId || req.user._id;

    if (order.user.toString() !== currentUserId.toString()) {
      return res
        .status(403)
        .json({ message: "Access denied. You did not place this order." });
    }

    order.orderStatus = "issue_reported";
    order.isDelivered = false;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Report Order Issue Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.orderStatus = "delivered";
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus,
  userConfirmDelivery,
  reportOrderIssue,
};
