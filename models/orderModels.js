import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderProduct: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        stock: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
      },
    ],

    shippingDetails: [
      {
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        pinCode: {
          type: Number,
          required: true,
        },
        phone: {
          type: Number,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    paymentDetails: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
    },

    orderStatus: {
      type: String,
      required: true,
      default: "Processing",
    },
    deliveredAt: {
      type: Date,
      default: Date.now(),
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timeseries: true,
  }
);

export const Order = mongoose.model("order", orderSchema);
