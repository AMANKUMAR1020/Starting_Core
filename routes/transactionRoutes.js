const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/trasactionController")
router.route("/").get(transactionController.getTransactions);
router.route("/:id").get(transactionController.getTransactionById);
router.route("/create").post(transactionController.createTransaction);

module.exports = router;
