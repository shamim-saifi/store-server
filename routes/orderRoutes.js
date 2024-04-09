import Express from "express";
import { AdminAuthentication, UserAuthentication } from "../middleware/Authentication.js";
import {
    AdminDeleteOrder,
  AdminGetAllOrder,
  AdminUpdateOrder,
  CreateOrder,
  getSinglelOrder,
  myOrder,
} from "../controllers/orderController.js"; 

const router = Express.Router();

router.route("/create/new").post(UserAuthentication, CreateOrder); 
router.route("/single/:id").get(UserAuthentication, getSinglelOrder); //for tracking order shipping
router.route("/getmyorder").get(UserAuthentication, myOrder); //all order of user

//admin routes
router.route("/admin/getallorder").get(UserAuthentication,AdminAuthentication, AdminGetAllOrder);
router.route("/admin/delete/:id").delete(UserAuthentication,AdminAuthentication, AdminDeleteOrder);
router.route("/admin/update/:id").put(UserAuthentication,AdminAuthentication, AdminUpdateOrder);

export default router;
