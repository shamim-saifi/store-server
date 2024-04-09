import mongoose from "mongoose";

const productSchema = new mongoose.Schema( 
  {
    name: {
      type: String,
      required: [true, "name field required"],
    },
    description: {
      type: String,
      required: [true, "description field required"],
    },
    category: {
      type: String,
      required: [true, "category field required"],
    },
    price: {
      type: Number,
      required: [true, "price field required"],
    },
    productImages: {
      image1: {
        public_id: String, 
        url: String, 
      },
      image2: {
        public_id: String,
        url: String,
      },
      image3: {
        public_id: String,
        url: String,
      },
      image4: {
        public_id: String,
        url: String,
      },
      image5: {
        public_id: String,
        url: String,
      },
    },
    stock: {
      type: Number,
      required: [true, "stock field required"],
      maxLength: [3, "stock can not more then 999"],
      default: 1,
    },
    totalReviewOfUsersOnProduct: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true, 
        },
        name: {
          type: String,
          required: true,
        },
        avatar: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
    rating: {
      type: Number,
      default:0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("product", productSchema);
