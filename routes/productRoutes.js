const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.route("/").get(productController.allProducts);
router.route("/new").post(productController.newProduct);
router.route("/:id").get(productController.productById);
router.route("/edit/:id").put(productController.editProduct);
router.route("/delete/:id").delete(productController.deleteProduct);

module.exports = router;
