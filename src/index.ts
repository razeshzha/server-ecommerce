import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { connectDatabase } from "./config/database.config";
import path from "path";
import fs from "fs";
import CustomError from "./middlewares/errorhandler.middleware";
import cors from "cors";

// importing routes
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import reviewRoutes from "./routes/review.routes";
import cartRoutes from './routes/cart.routes';
import wishlistRoutes from './routes/wishlist.routes';
import orderRoutes from './routes/order.routes';

const app = express();
const PORT = process.env.PORT || 8000;
const DB_URI = process.env.DB_URI || "";

console.log(`Connecting to database at ${DB_URI}`);
connectDatabase(DB_URI);

// using middlewares
app.use(cors({
  origin: '*',
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serving static files
const uploadsPath = path.join(__dirname, "../", "uploads");
if (fs.existsSync(uploadsPath)) {
  app.use("/api/uploads", express.static(uploadsPath));
} else {
  console.error("Uploads folder not found");
}

// using routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/review", reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/order', orderRoutes);

// health check route
app.use("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is up & running" });
});

// handle not found paths
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const message = `Cannot ${req.method} on ${req.originalUrl}`;
  const error = new CustomError(message, 404);
  next(error);
});

// error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message || "Something went wrong";

  res.status(statusCode).json({
    status,
    success: false,
    message,
  });
});

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
