const User = require('../models/User');
const bcrypt = require('bcrypt');


//login controller
exports.loginController = async (req, res)=>{
    const {email, password}= req.body;

    try{
        const user = await User.findOne({email});
        if(!user) {
            return res.render('login',{error:[{msg: 'Invalid Email or Password'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.render('login', {error:[{msg: 'Invalid Email or Password'}]});
        }

        if (user.isBlocked) return res.render('login', {error:[{msg: 'Your account is blocked'}]});
        
        req.session.isAuth = true;
        req.session.user = {username: user.name, email: user.email, role: user.role};

        res.redirect('/home');

    }catch(err){
        console.error(err);
        res.render('login',{error:[{msg:'Something went wrong. Please try again'}]});
    }
};

//logout controller

exports.logoutController = async (req, res)=>{
     req.session.destroy(err =>{
        if (err) {
            console.error(err);
            res.redirect('/home'); 
        }else{
        res.clearCookie('connect.sid');
        res.redirect('/login')}
    })
}

//signup controller

exports.signupController = async (req,res)=>{
    const {name, email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.render('signup',{error:[{msg:'Email already in use'}]});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({name, email, password: hashedPassword, role: 'user'});
        await  user.save();
        return res.status(201).redirect('/login');

    } catch (err){
        console.error(err)
        return res.status(500).render('signup', {error: [{msg:'Something went wrong. Please try again'}]});
    }
};

//admin login controller

exports.adminLoginController = async (req,res)=>{
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(401).render('adminLogin', {error:[{msg: 'Invalid Username or Password'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).render('adminLogin', {error:[{msg: 'Invalid Username or Password'}]});
        }

        if (user.role !== 'admin') {
            return res.status(403).render('adminLogin', { error: [{ msg: 'Access Denied: Not an admin user' }] });
        }


        req.session.isAuth = true;
        req.session.user = {username: user.name, email:user.email, role: user.role};

        res.redirect('/admin/dashboard')

    } catch (err) {
        console.error(err);
        return res.status(500).render('adminLogin',{error:[{msg:'Something went wrong. Please try again'}]});
        
    }
}

// admin dashboard controller
exports.adminDashboardController = async (req, res) => {
  try {
    const searchQuery = req.query.search || ''; 

    // find users by name or email 
    const users = await User.find(
      {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } }
        ]
      },
      { name: 1, email: 1, role: 1, isBlocked:1 }
    );

    return res.status(200).render('adminDashboard', {
      users,
      searchQuery,
    });
  } catch (error) {
    console.error("Error loading admin dashboard:", error);
    return res.status(500).send("Server Error: Unable to load admin dashboard");
  }
};


//edit user controller
exports.getEditController = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.send("User not found");

    res.render('adminEditUser', { user });
  } catch (err) {
    console.error(err);
    res.send("Error loading edit form");
  }
};

exports.postEditController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.send("User not found");

    user.name = name;
    user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.send("Error updating user");
  }
};


//block controller
exports.blockController =  async (req, res) => {

  try {
    const user = await User.findById(req.params.id);
    if(!user){
      return res.status(404).send('User not found');
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.redirect('/admin/dashboard');
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user block status');
  }

}