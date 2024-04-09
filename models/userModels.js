import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name field required"],
  },
  email: {
    type: String,
    required: [true, "email field required"],
    unique: true,
  },
  phone: {
    type: Number,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "password field required"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true, 
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });

//create web token for authentication
// userSchema.methods.createJWTtoken = function () {
//   return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_SECRET_expiresIn,
//   });
// };

//check user password with hasPassword for authentication
// userSchema.methods.checkPassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

export const User = mongoose.model("user", userSchema);
