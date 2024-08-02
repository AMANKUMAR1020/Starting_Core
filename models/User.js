const mongoose = require("mongoose");

const User = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        username: {
            type: String,
            require: true,
        },
        password: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            required: true,
        },
        mobileno: {
            type: String,
            required: true,
        },
        listed_products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        total_traansaction: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Transaction",
            },
        ],
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("User", User);















// const mongoose = require('mongoose');

// const User = new mongoose.Schema({
//     username: {
//         type: String,
//     },
//     password: {
//         type: String,
//     },
//     email: {
//         type: String,
//     },
//     photo: {
//         type: String,
//     },
//     musiclist: [{
//         type: mongoose.Schema.Types.ObjectId, // referring music id
//         ref: 'Music'
//     }]
// });

// module.exports = mongoose.model('User', User);
