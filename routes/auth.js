const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {signupValidationRules, loginValidationRules, validationResultMiddleware ,isAuth, isAdmin, noCache} = require('../middleware/middlewares')

//user routes

//home route
router.get('/home', noCache, isAuth, (req,res)=> {
    req.session.visited = true ;
    res.render('home', {username: req.session.user.username})});

//signup route
router.get('/signup', (req, res) => res.render('signup'));
router.post('/signup', signupValidationRules, validationResultMiddleware('signup'), authController.signupController);

//login route
router.get('/login', (req, res) => res.render('login'));
router.post('/login', loginValidationRules, validationResultMiddleware('login'), authController.loginController);

//logout route
router.get('/logout', authController.logoutController);

//admin routes

//admin login route
router.get('/admin/login', (req,res)=> res.render('adminLogin'));
router.post('/admin/login',loginValidationRules,validationResultMiddleware('adminLogin'), authController.adminLoginController);

//admin dashboard route
router.get('/admin/dashboard', noCache,isAdmin, authController.adminDashboardController);

//edit user route
router.get('/admin/edit/:id', noCache, isAdmin, authController.getEditController );

router.post('/admin/edit/:id',noCache, isAdmin, authController.postEditController );

//block/unblock route
router.get('/admin/block/:id',noCache, isAdmin, authController.blockController);

//redirect route
router.get('/', (req, res) => res.redirect('/login'));


module.exports = router;