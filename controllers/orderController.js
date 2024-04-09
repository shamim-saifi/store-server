import { Order } from "../models/orderModels.js";
import { Product } from "../models/productModels.js";

export const CreateOrder = async (req, res) => {
  try {
    const {
      orderProduct,
      shippingDetails,
      shippingPrice,
      taxPrice,
      itemsPrice,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      orderProduct,
      shippingDetails,
      shippingPrice,
      taxPrice,
      itemsPrice,
      totalPrice,
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "order has been created",
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSinglelOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "order not found",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const myOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    let order = await Order.find({ user: userId });
    if (order.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "order not found",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//admin routers
export const AdminGetAllOrder = async (req, res) => {
  try {
    let order = await Order.find();
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "orders not found",
      });
    }
    let totalAmount = 0;
    order.forEach((ord) => {
      totalAmount += ord.totalPrice;
    });
    res.status(200).json({
      success: true,
      order,
      totalAmount,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const AdminDeleteOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "orders not found",
      });
    }
    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "order has been deleted",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const AdminUpdateOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "orders not found",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "orders has been Delivered",
      });
    }

    order.orderProduct.forEach(async (ord) => {
      await UpdateStock(ord.product, ord.quantity);
    });
    // Update stock for each product in the order
    // for (const ord of order.orderProduct) {
    //   const product = await Product.findById(ord.product);
    //   if (!product) {
    //     return res.status(404).json({
    //       success: false,
    //       message: `Product with ID ${ord.product} not found`,
    //     });
    //   }

    //   // Check if stock will become negative
    //   if (product.stock - ord.qty < 0) {
    //     return res.status(400).json({
    //       success: false,
    //       message: `Insufficient stock for product ${product.name}`,
    //     });
    //   }

    //   product.stock -= ord.qty;
    //   await product.save({ validateBeforeSave: false });
    // }

    // Update order status and deliveredAt timestamp if status is "Delivered"
    
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

async function UpdateStock(productID, quantity) {
  let product = await Product.findById(productID);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}
