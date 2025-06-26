const express=require('express')
const router=express.Router();
const{registerUser, profileview}=require('../controllers/authController');
const {loginUser} = require('../controllers/authController');
const {login}=require('../controllers/authController');
const {create}=require('../controllers/authController');
const {profile}=require('../controllers/authController');
const isLogged = require('../middlewares/isLogged');
const {uploadImage}=require('../controllers/authController')
const uploadpic=require('../config/multer-config')
router.get("/index",create)
router.get("/login",login)
router.post("/create",registerUser)
router.post("/login",loginUser)
router.get("/profile",isLogged,profile)
router.post("/uploadimage",isLogged,uploadpic.single("image"), uploadImage)
module.exports=router