"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const database_config_1 = require("./config/database.config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const errorhandler_middleware_1 = __importDefault(require("./middlewares/errorhandler.middleware"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet")); // You will need to install helmet as mentioned below
// importing routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
const DB_URI = process.env.DB_URI || "";
if (!DB_URI) {
    console.error("DB_URI environment variable is missing!");
    process.exit(1); // Exit the application if DB_URI is not set
}
console.log(`Connecting to database at ${DB_URI}`);
(0, database_config_1.connectDatabase)(DB_URI);
// Use security middleware
app.use((0, helmet_1.default)());
// using middlewares
app.use((0, cors_1.default)({
    origin: '*',
    credentials: false,
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// serving static files
const uploadsPath = path_1.default.join(__dirname, "../", "uploads");
if (fs_1.default.existsSync(uploadsPath)) {
    app.use("/api/uploads", express_1.default.static(uploadsPath));
}
else {
    console.error("Uploads folder not found");
}
// using routes
app.use("/api/user", user_routes_1.default);
app.use("/api/product", product_routes_1.default);
app.use("/api/category", category_routes_1.default);
app.use("/api/review", review_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/wishlist', wishlist_routes_1.default);
app.use('/api/order', order_routes_1.default);
// health check route
app.use("/", (req, res) => {
    res.status(200).json({ message: "Server is up & running" });
});
// handle not found paths
app.all("*", (req, res, next) => {
    const message = `Cannot ${req.method} on ${req.originalUrl}`;
    const error = new errorhandler_middleware_1.default(message, 404);
    next(error);
});
// error handler
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || "error";
    const message = error.message || "Something went wrong";
    console.log(error);
    res.status(statusCode).json({
        status,
        success: false,
        message,
    });
});
// Graceful shutdown
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
app.use((error, req, res, next) => {
    console.log(error);
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message || 'something went wrong!';
    res.status(statusCode).json({
        status: status,
        success: false,
        message: message,
        error
    });
});
// process.on('SIGINT', () => {
//   console.log('Shutting down gracefully...');
//   server.close(() => {
//     console.log('Closed all connections');
//     process.exit(0);
//   });
// });
