const express = require("express");

const paymentRouter = express.Router();
const authController = require("../../controllers/staff/authController");

const acadedemicPaymentController = require("../../controllers/academic/payment");
paymentRouter.use(authController.protect);
paymentRouter
  .route("/create-checkout-session")
  .post(acadedemicPaymentController.checkout);

paymentRouter.route("/").get(acadedemicPaymentController.getPaiments);

paymentRouter.route("/user").get(acadedemicPaymentController.getMyPaiements);
module.exports = paymentRouter;
