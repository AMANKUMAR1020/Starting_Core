const User = require("../models/User");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc GetAll products
// @route GET /products
// @access Public
const allProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().lean();
    // console.log(req.session)
    
    console.log(req.session.userId)
    if(!req.session.userId){
        return res.status(400).json({ message: "session time over, login again" });
    }

    if (!products?.length) {
        return res.status(400).json({ message: "No products found" });
    }

    res.json({ products: products });
});

// @desc AddNewProduct product
// @route POST /products
// @access Private
const newProduct = asyncHandler(async (req, res) => {
    const { name, category, price, description, userid } = req.body;


    if (!name || !category || !price || !description || !userid) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userid).exec();

//    console.log(req.session.userId, user._id.toString())
    if  (!user || req.session.userId !== user._id.toString()) {
        return res.status(400).json({ message: "Invalid user" });
    }

    const product = await Product.create({
        name,
        category,
        price,
        description,
        userid,
    });

    const updateUser = await User.findOneAndUpdate(
        { _id: userid },
        { $push: { listed_products: product._id } },
        { new: true }
    );
    
    if (!updateUser) {
        res.status(400).json({ message: 'user not updated' });
    }
    
    res.status(201).json({
        message: `New product created successfully`,
        product: product,
    });
});

// @desc productById product
// @route GET /products/:id
// @access Private
const productById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "Product's id required" });
    }

    //    console.log(req.session.userId)
    if  (!req.session.userId) {
        return res.status(400).json({ message: "Invalid user" });
    }


    const product = await Product.findById(id).exec();

    if (product) {
        res.status(200).json({
            message: `Product fetched successfully`,
            product: product,
        });
    } else {
        res.status(400).json({ message: "Invalid product id" });
    }
});

// @desc UpdateProduct products
// @route PUT /products/:id
// @access Private
const editProduct = asyncHandler(async (req, res) => {
    const { name, category, price, description, userid } = req.body;
    const id = req.params.id;

    const product = await Product.findById(id).exec();

    if (!product) {
        return res.status(400).json({ message: "Invalid product" });
    }

    const user = await User.findById(userid).exec();

    //    console.log(req.session.userId, user._id.toString())
    if  (!user || req.session.userId !== user._id.toString()) {
        return res.status(400).json({ message: "Invalid user" });
    }

    if (!name || !category || !price || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, category, price, description, userid },
        { new: true },
    );
    

    if (!updatedProduct) {
        return res.status(400).json({
            message: "Some error occurred while updating the product",
        });
    }

    res.status(200).json({
        message: `Product updated successfully`,
        product: updatedProduct,
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "Product's id required" });
    }

    const product = await Product.findById(id).exec();

    if (!product) {
        return res.status(400).json({ message: "Invalid product id" });
    }

    const updateUser = await User.findOneAndUpdate(
        { _id: product.userid },
        { $pull: { listed_products: product._id } },
        { new: true }
    );
    
    if (!updateUser) {
        return res.status(400).json({ message: 'User not updated' }); // Added the 'return' statement
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (deletedProduct) {
        res.status(200).json({
            message: `Product deleted successfully`,
            product: deletedProduct,
        });
    } else {
        res.status(400).json({ message: "Invalid product id" });
    }
});


module.exports = {
    allProducts,
    newProduct,
    productById,
    editProduct,
    deleteProduct,
};
