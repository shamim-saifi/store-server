import { Product } from "../models/productModels.js";
import { User } from "../models/userModels.js";
import searchAndFilter from "../utils/searchAndFilter.js";
import cloudinary from "cloudinary";

export const getSingalProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//stil working
export const getAllProduct = async (req, res) => {
  try {
    // const resultPerPage = 8;
    // const productsCount = await Product.countDocuments();

    // const apiFeature = new searchAndFilter(Product.find(), req.query)
    //   .search()
    //   .filter();

    // let products = await apiFeature.query;

    // let filteredProductsCount = products.length;

    // apiFeature.pagination(resultPerPage);

    // products = await apiFeature.query;
    // res.status(200).json({
    //   success: true,
    //   products,
    //   productsCount,
    //   resultPerPage,
    //   filteredProductsCount,
    // });

    let product = await Product.find();
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "product not found",
      });
    }

    res.status(200).json({
      success: true,
      product: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchProduct = async (req, res) => {
  try {
    let product;
    if (req.params.key) {
      product = await Product.find({
        $or: [
          { name: { $regex: req.params.key } },
          { category: { $regex: req.params.key } }
        ],
      });
    } else {
      product = await Product.find();
    }

    // const { search, category, price  } = req.query;
    // const { search, category, minPrice, maxPrice, minRating } = req.query;

    // let filters = {};
    // if (search) filters.name = new RegExp(search, 'i');
    // if (category) filters.category = category;
    // if (category) filters.price = price;
    // if (minPrice) filters.price = { $gte: parseFloat(minPrice) };
    // if (maxPrice) filters.price = { ...filters.price, $lte: parseFloat(maxPrice) };
    // if (minRating) filters.rating = { $gte: parseInt(minRating) };

    // const product = await Product.find(filters);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "product loadedd",
      product: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchByPriceAndCategory = async (req, res) => {
  try {
    const {  category, price  } = req.query;

    // let product;
    // if (req.params.key) {
    //   product = await Product.find({
    //     $or: [
    //       { name: { $regex: category } },
    //       { category: { $regex: category } },
    //       { price: { $regex: price } },
    //     ],
    //   });
    // } else {
    //   product = await Product.find();
    // }

    let query = {};

    if (category) {
      query.category = { $regex: category ,$options:"i"}; 
    }

    if (price) {
      const [minPrice, maxPrice] = price.split('-').map(parseFloat);
      if (!isNaN(minPrice)) {
        query.price = { $gte: minPrice };
      }
      if (!isNaN(maxPrice)) {
        query.price = { ...query.price, $lte: maxPrice };
      }
    }

    const product = await Product.find(query);

    if (!product || product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Products not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "product loadedd",
      product: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const filterLowToHighProduct = async (req, res) => {
  try {
    // Sort products by low to high price
    const product = await Product.find().sort({ price: 1 });

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "product loadedd",
      product: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const filterHighToLowProduct = async (req, res) => {
  try {

    // Sort products by high to low price
    const product = await Product.find().sort({ price: -1 });

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "product loadedd",
      product: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "All Products not found",
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product has been update",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const CreateReview = async (req, res) => {
  try {
    const { productId, comment, rating } = req.body;

    let product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Products not found",
      });
    }

    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "login Please!",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      avatar: user.avatar.url,
      comment,
    };

    const test = product.totalReviewOfUsersOnProduct.find((rev) => {
      return rev.user.toString() === req.user._id.toString();
    });

    if (test) {
      product.totalReviewOfUsersOnProduct.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          (rev.rating = rating), (rev.comment = comment);
        }
      });
    } else {
      product.totalReviewOfUsersOnProduct.push(review);
    }

    let avg = 0;
    product.rating = product.totalReviewOfUsersOnProduct.forEach((rev) => {
      avg += rev.rating;
    });
    product.rating = avg / product.totalReviewOfUsersOnProduct.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "review has been created",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const DeleteReview = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Products not found",
      });
    }
    const userReview = product.totalReviewOfUsersOnProduct.find((rev) => {
      return rev.user.toString() === req.user._id.toString();
    });

    if (!userReview) {
      return res.status(400).json({
        success: false,
        message: "Review not found",
      });
    }
    const review = product.totalReviewOfUsersOnProduct.filter((rev) => {
      return rev.user.toString() !== req.user._id.toString();
    });

    let avg = 0;
    product.rating = product.totalReviewOfUsersOnProduct.forEach((rev) => {
      avg += rev.rating;
    });
    product.rating = avg / product.totalReviewOfUsersOnProduct.length;
    product.totalReviewOfUsersOnProduct = review;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "product has been deleted",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const GetAllReview = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Reviews not found", 
      });
    }

    res.status(200).json({
      success: true,
      Reviews: product.totalReviewOfUsersOnProduct,
      rating: product.rating,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//admin CreateProduct
export const CreateProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, productImages } =
      req.body;

    // if (!name || !description || !category || !price || !stock ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All values required",
    //   });
    // }
    // console.log(name, description, category, price, stock, productImages);

    const Myuploader1 = await cloudinary.v2.uploader.upload(
      productImages.image1,
      { folder: "store/product" }
    );
    const Myuploader2 = await cloudinary.v2.uploader.upload(
      productImages.image2,
      { folder: "store/product" }
    );
    const Myuploader3 = await cloudinary.v2.uploader.upload(
      productImages.image3,
      { folder: "store/product" }
    );
    const Myuploader4 = await cloudinary.v2.uploader.upload(
      productImages.image4,
      { folder: "store/product" }
    );
    const Myuploader5 = await cloudinary.v2.uploader.upload(
      productImages.image5,
      { folder: "store/product" }
    );

    // if(productImages){
    //   if(productImages.image1){
    //     const Myuploader = await cloudinary.v2.uploader.upload(productImages.image1,{folder:'aahana/product'})

    //     avatar: {
    //       public_id: Myuploader.public_id,
    //       url: Myuploader.secure_url,
    //     },
    //   }
    // }

    let product = await Product.create({
      name,
      description,
      category,
      price,
      stock,
      productImages: {
        image1: {
          public_id: Myuploader1.public_id,
          url: Myuploader1.secure_url,
        },
        image2: {
          public_id: Myuploader2.public_id,
          url: Myuploader2.secure_url,
        },
        image3: {
          public_id: Myuploader3.public_id,
          url: Myuploader3.secure_url,
        },
        image4: {
          public_id: Myuploader4.public_id,
          url: Myuploader4.secure_url,
        },
        image5: {
          public_id: Myuploader5.public_id,
          url: Myuploader5.secure_url,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Product has been created",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Products not found",
      });
    }
    await cloudinary.v2.uploader.destroy(
      product.productImages.image1.public_id,
      { folder: "store/product" }
    );
    await cloudinary.v2.uploader.destroy(
      product.productImages.image2.public_id,
      { folder: "store/product" }
    );
    await cloudinary.v2.uploader.destroy(
      product.productImages.image3.public_id,
      { folder: "store/product" }
    );
    await cloudinary.v2.uploader.destroy(
      product.productImages.image4.public_id,
      { folder: "store/product" }
    );
    await cloudinary.v2.uploader.destroy(
      product.productImages.image5.public_id,
      { folder: "store/product" }
    );

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product has been delete yes",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
