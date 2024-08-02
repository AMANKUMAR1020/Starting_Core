const mongoose = require("mongoose");

const Transaction = new mongoose.Schema(
    {
        productids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }],
        userid:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        isSuccesful: {
            type: Boolean,
            fefault:false,
            require: true,
        },
        paymentId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Transaction", Transaction);