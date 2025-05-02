import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price should be greater than 0'],
    },
    description: {
      type: String,
      minlength: [50, 'Description should be at least 50 characters long'],
      trim: true,
    },
    coverImage: {
      public_id: {
        type: String,
        required: [true, 'Cover image public_id is required'],
      },
      path: {
        type: String,
        required: [true, 'Cover image path is required'],
      },
    },
    images: [
      {
        public_id: {
          type: String,
          required: [true, 'Image public_id is required'],
        },
        path: {
          type: String,
          required: [true, 'Image path is required'],
        },
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: [true, 'Author is required'],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'category',
      required: [true, 'Category is required'],
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'review',
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('product', productSchema);
export default Product;
