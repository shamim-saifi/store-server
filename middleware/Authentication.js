import jwt from "jsonwebtoken";
import { User } from "../models/userModels.js";

export const UserAuthentication = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "token has been Expire",
      });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodeToken._id);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const AdminAuthentication = async (req, res, next) => {
  try {
    
      if (req.user.role!=="admin") {
        return res.status(400).json({
          success: false,
          message: `Role : ${req.user.role} is not allowed to access this Resource`,
        });
      }
      next();
    
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
