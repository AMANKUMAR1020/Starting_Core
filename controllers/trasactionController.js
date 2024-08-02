const User = require("../models/User");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Transaction = require("../models/Transaction");

// @desc GetAll transactions
// @route GET /
// @access Public
const getTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find().lean();

    if (!transactions?.length) {
        return res.status(400).json({ message: "No transactions found" });
    }

    if  (!req.session.userId) {
        return res.status(400).json({ message: "Invalid user" });
    }

    res.json({ transactions: transactions });
});

// @desc Get transaction by ID
// @route GET /:id
// @access Public
const getTransactionById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "Invalid transaction ID" });
    }

    if  (!req.session.userId) {
        return res.status(400).json({ message: "Invalid user" });
    }

    const transaction = await Transaction.findById({id}).exec();

    if (!transaction) {
        return res.status(400).json({ message: "Transaction not found" });
    }

    res.status(200).json({
        message: `Transaction fetched successfully`,
        transaction: transaction,
    });
});


// @desc Create a new transaction
// @route POST /transaction
// @access Public
const createTransaction = asyncHandler(async (req, res) => {
    const { productids, userId, isSuccessful, paymentId } = req.body;// here productIds contain array

    const user = await User.findById(userId).exec();

    if (!user && req.session.userId !== user._id) {
        return res.status(400).json({ message: "Invalid user" });
    }
    
    if (!paymentId) {
        return res.status(400).json({ message: "paymentId missing" });
    }
    
    const newTransaction = await Transaction.create({
        productids,
        userId,
        isSuccessful,
        paymentId,
    });

    if (!newTransaction) {
        return res.status(400).json({
            message: "Some error occurred, transaction not processed",
        });
    }

    const updateUser = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { total_traansaction: newTransaction._id } },
        { new: true }
    );
    
    if (!updateUser) {
        res.status(400).json({ message: 'user not updated' });
    }

    res.status(201).json({
        message: `New transaction created successfully`,
        newTransaction: newTransaction,
    });
});

module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
};