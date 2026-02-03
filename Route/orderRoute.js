const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus,
  userConfirmDelivery,
  reportOrderIssue,
  cancelOrder,
} = require("../Controller/orderController");
const { requireSignin, adminMiddleware } = require("../Middlewares/auth");

router
  .route("/")
  .post(requireSignin, addOrderItems)
  .get(requireSignin, adminMiddleware, getOrders);

router.route("/update").post(requireSignin, adminMiddleware, updateOrderStatus);
router.route("/myorders").get(requireSignin, getMyOrders);

router.route("/:id/pay").put(requireSignin, updateOrderToPaid);

router
  .route("/:id/deliver")
  .put(requireSignin, adminMiddleware, updateOrderToDelivered);

router.route("/:id/confirm-delivery").put(requireSignin, userConfirmDelivery);
router.route("/:id/report-issue").put(requireSignin, reportOrderIssue);

router.route("/:id/cancel").put(requireSignin, cancelOrder);

router.route("/:id").get(requireSignin, getOrderById);

module.exports = router;
