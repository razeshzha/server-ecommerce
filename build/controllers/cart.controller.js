"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItemFromCart = exports.clearCart = exports.getCartByUserId = exports.create = void 0;
const asyncHandler_util_1 = require("../utils/asyncHandler.util");
const errorhandler_middleware_1 = __importDefault(require("../middlewares/errorhandler.middleware"));
const cart_model_1 = require("../models/cart.model");
const product_model_1 = __importDefault(require("../models/product.model"));
exports.create = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    console.log("👊 ~ cart.controller.ts:10 ~ create ~ quantity:", quantity);
    const userId = req.user._id;
    let cart;
    if (!userId) {
        throw new errorhandler_middleware_1.default("userId is required", 400);
    }
    if (!productId) {
        throw new errorhandler_middleware_1.default("productId is required", 400);
    }
    cart = yield cart_model_1.Cart.findOne({ user: userId });
    if (!cart) {
        cart = new cart_model_1.Cart({ user: userId, items: [] });
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new errorhandler_middleware_1.default("product not found", 404);
    }
    const existingProduct = cart.items.find((item) => item.product.toString() === productId);
    console.log("👊 ~ cart.controller.ts:39 ~ create ~ existingProduct:", existingProduct);
    if (existingProduct) {
        existingProduct.quantity += Number(quantity);
        // cart.items.push(existingProduct);
    }
    else {
        cart.items.push({ product: productId, quantity });
    }
    yield cart.save();
    res.status(201).json({
        status: "success",
        success: true,
        message: "Product added to cart",
        data: cart,
    });
}));
exports.getCartByUserId = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const cart = yield cart_model_1.Cart.findOne({ user: userId })
        .populate("user", "-password")
        .populate("items.product");
    res.status(200).json({
        status: "success",
        success: true,
        message: "Cart fetched successfully",
        data: cart,
    });
}));
exports.clearCart = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const cart = yield cart_model_1.Cart.findOne({ user: userId });
    if (!cart) {
        throw new errorhandler_middleware_1.default("Cart does not created yet.", 400);
    }
    yield cart_model_1.Cart.findOneAndDelete({ user: userId });
    res.status(200).json({
        status: "success",
        success: true,
        message: "Cart cleared successfully",
        data: null,
    });
}));
exports.removeItemFromCart = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const userId = req.user._id;
    if (!productId) {
        throw new errorhandler_middleware_1.default("productId is required", 400);
    }
    const cart = yield cart_model_1.Cart.findOne({ user: userId });
    if (!cart) {
        throw new errorhandler_middleware_1.default("Cart does not created yet.", 400);
    }
    cart.items.pull({ product: productId });
    const updatedCart = yield cart.save();
    res.status(200).json({
        status: "success",
        success: true,
        message: "Cart updated successfully",
        data: updatedCart,
    });
}));
