const Payment = require("../../models/academic/Payment");
const catchAsync = require("../../utils/catchAsync");
const { uuid } = require("uuidv4");

exports.checkout = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const stripe = require("stripe")(
    "sk_test_51J5TX7LLiFJrGSKSKvf4QJMIZjy5jUTX0ogy8QXq7IaomItIs4JjVepjFWsqkd0oAxXWWYBaxfdMPRQ7aabOuJ1400fXagkfNr"
  );
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
        return;
      }
    }
  );

  const newPayment = new Payment({
    user: req.user._id,
    amount: req.body.amount,
    paymentDate: Date.now(),
  });
  await newPayment.save();

  res.status(200).json(newPayment);
});

exports.getMyPaiements = catchAsync(async (req, res, next) => {
  const payments = await Payment.find({ user: req.user._id });
  res.status(200).json(payments);
});

exports.getPaiments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find().populate("user");
  res.status(200).json(payments);
});
