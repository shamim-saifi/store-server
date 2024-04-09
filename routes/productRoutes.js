import Express from 'express';
import { CreateProduct, CreateReview, DeleteReview, GetAllReview, deleteProduct, filterHighToLowProduct, filterLowToHighProduct,  getAllProduct, getSingalProduct, searchByPriceAndCategory, searchProduct, updateProduct } from '../controllers/productController.js';
import { AdminAuthentication, UserAuthentication } from '../middleware/Authentication.js';

 
const router=Express.Router(); 

//admin route
router.route('/create/new/product').post(UserAuthentication, AdminAuthentication,CreateProduct);
router.route('/update/:id').put(UserAuthentication, AdminAuthentication, updateProduct);
router.route('/delete/:id').delete(UserAuthentication, AdminAuthentication, deleteProduct);

router.route('/create/review').put(UserAuthentication, CreateReview);
router.route('/getall/review/:id').get( GetAllReview);
router.route('/delete/review/:id').delete(UserAuthentication, DeleteReview);

router.route('/all').get(getAllProduct);
router.route('/lowtohigh').get(filterLowToHighProduct);
router.route('/hightolow').get(filterHighToLowProduct);

router.route('/price/and/category').get(searchByPriceAndCategory);  //query params for price and categroy


router.route('/search/:key').get(searchProduct);      // search in input box
router.route('/singal/:id').get(getSingalProduct);    //params

export default router;