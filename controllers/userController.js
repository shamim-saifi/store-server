import { User } from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";

export const Registration = async (req, res) => {
  try {
    const { name, email, phone, password, avatar } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User Already Exist Please! Login",
      });
    }

    const Myuploader = await cloudinary.v2.uploader.upload(avatar, {
      folder: "store/user",
    });

    const hasPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      phone,
      password: hasPassword,
      avatar: {
        public_id: Myuploader.public_id,
        url: Myuploader.secure_url,
      },
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res
      .status(201)
      .cookie("token", token, {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite:"none",
        secure:true,
      })
      .json({
        success: true,
        message: "Registration Success",
        user,
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "all value required",
      });
    }

    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email and Password E-one",
      });
    }

    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email and Password E-two",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res
      .status(201)
      .cookie("token", token, {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite:"none",
        secure:true,
      })
      .json({
        success: true,
        message: "Login Success",
        user,
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const Logout = async (req, res) => {
  try {
    res
      .status(201)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite:"none",
        secure:true,
      })
      .json({
        success: true,
        message: "Logout Success",
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const UserProfile = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Time-Out Please! Login",
      });
    }
    res.status(201).json({
      success: true,
      message: "user load Success",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const ChangeUserAvatar = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Time-Out Please! Login",
      });
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const Myuploader = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "store/user",
    });

    user.avatar.public_id = Myuploader.public_id;
    user.avatar.url = Myuploader.secure_url;

    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: "Avatar has been update",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const UpdateUserDetails = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Time-Out Please! Login",
      });
    }

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (phone) {
      user.phone = phone;
    }

    if (address) {
      user.address = address;
    }

    // let user = await User.findByIdAndUpdate(req.user._id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: "user has been update",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const Contact = async (req, res) => {
  try {
    const { name, email, comment } = req.body;
    if (!name || !email || !comment) {
      return res.status(400).json({
        success: false,
        message: "name email comment required",
      });
    }
    const subject = "Contact from E-Commerce Web";
    const UserEmail = process.env.SMTP_SENDER_EMAIL;
    const message = `Hi, I am ${name}\n And My Email is ${email} \n\n ${comment}`;
    sendEmail(subject, UserEmail, message);

    res.status(200).json({
      success: true,
      message: "Comment has been send", 
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email not Found Please! do Registration",
      });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    user.save({ validateBeforeSave: false });

    const subject = "Re-Set Your Password";
    const url = `${process.env.FRONTEND_URL}/api/v1/user/reset/password/${resetToken}`;
    const message = `Welcome sir/mam\n This is Your Re-Set Password Link - ${url}\n if Already Re-Set so, you can ignore`;
    sendEmail(subject, email, message);

    res.status(200).json({
      success: true,
      message: `Forget Password Link has been send to : ${email}`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const ResetPassword = async (req, res) => {
  //get new password re-enter
  //get token with req.param
  //has it as we did in forget password
  //find user who has has-token in their collection
  //has new password
  //save new password in DB
  //undefine token ans expires

  try {
    const { password } = req.body;
    const { token } = req.params;
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    let user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token has been Expires",
      });
    }

    const hasPassword = await bcrypt.hash(password, 10);
    user.password = hasPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Password has been change of ${user.name}`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//admin
export const AdminDeleteUser = async (req, res) => {
  try {

    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not Found. Admin sir",
      });
    }
    
    await cloudinary.v2.uploader.destroy(user.avatar.public_id, { folder: "store/user",});

    await user.deleteOne();

    res.status(201).json({
      success: true,
      message: "user delete Successfully.  Admin sir",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const AdminGetAllUser = async (req, res) => {
  try {

    let user = await User.find();
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not Found. Admin sir",
      });
    }

    res.status(201).json({
      success: true,
      message: "user load Successfully.  Admin sir",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const AdminChangeUserRole = async (req, res) => {
  try {
    const { role,id } = req.body;

    let user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    if (role) {
      user.role = role;
    }

    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: "Now user has become Admin too",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
