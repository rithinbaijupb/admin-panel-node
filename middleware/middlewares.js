const {body, validationResult} = require('express-validator');

//validation rules
const signupValidationRules = [

    body('name').notEmpty().withMessage('Username is required'),

    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid Email'),

    body('password').notEmpty().withMessage('Password is required').isLength({min:6, max:10}).withMessage('The password must be between 6 and 10 characters long'),

    body('confirmPassword').notEmpty().withMessage('Please confirm your password')
    .custom((val, {req})=>{
      if(val !== req.body.password){
        throw new Error('Passwords do not match');
      }
      return true;
    })
    
];

const loginValidationRules = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid Email'),

  body('password').notEmpty().withMessage('Password is required')
];

//validation result
const validationResultMiddleware = (viewName) => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).render(viewName, { error: errors.array() });
  }
  next();
};

//auth middleware
const isAuth = (req,res,next)=>{
    if(req.session && req.session.isAuth){
       next();
    }else{
        res.status(401).render('login',{error: [{msg:'Access Denied'}]})
    }
}

//admin validation middleware
const isAdmin = (req, res, next) => {
  if (!req.session || !req.session.isAuth) {
    return res.status(401).render('adminLogin', {
      error: [{ msg: 'Session expired. Please log in again.' }]
    });
  }
  
  if (req.session.user.role !== 'admin') {
    return res.status(403).render('adminLogin', {
      error: [{ msg: 'Access Denied: Admins only' }]
    });
  }

  next();
};

const noCache = (req,res,next)=>{
  res.set('cache-control', 'no-cache, no-store, must-revalidate, private');
  res.set('Pragma','no-cache');
  res.set('Expires','0');
  next();
}



module.exports = {signupValidationRules, loginValidationRules, validationResultMiddleware ,isAuth, isAdmin, noCache};