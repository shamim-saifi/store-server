import Express from "express";
import {
  AdminChangeUserRole,
  AdminDeleteUser,
  AdminGetAllUser,
  ChangeUserAvatar,
  Contact,
  ForgetPassword,
  Login,
  Logout,
  Registration,
  ResetPassword,
  UpdateUserDetails,
  UserProfile,
} from "../controllers/userController.js"; 
import { AdminAuthentication, UserAuthentication } from "../middleware/Authentication.js";

const router = Express.Router();

router.route("/registration").post(Registration);
router.route("/login").post(Login);
router.route("/logout").get(UserAuthentication, Logout);

router.route("/me").get(UserAuthentication,UserProfile );
router.route("/change/avatar").post(UserAuthentication,ChangeUserAvatar );
router.route("/update").put(UserAuthentication,UpdateUserDetails );

router.route("/contact").post(Contact);
router.route("/forget/password").post(ForgetPassword);
router.route("/reset/password/:token").put(ResetPassword);

//admin
router.route("/getalluser").get(UserAuthentication,AdminAuthentication, AdminGetAllUser);
router.route("/delete/:id").delete(UserAuthentication,AdminAuthentication, AdminDeleteUser);
router.route("/change/role").put(UserAuthentication,AdminAuthentication, AdminChangeUserRole);


export default router;
