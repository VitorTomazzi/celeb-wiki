const express = require('express');
const router = express.Router();

const User = require('../models/User')

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;



router.get('/signup', (req, res, next) => {

  res.render('user/signup');

})

router.post('/signup', (req, res, next) => {

let admin = false;

  if(req.user){
    //here we check if logged in
    if(req.user.isAdmin){
      //here we check logged in user is an admin
      admin = req.body.role? req.body.role : false;
      //same as 
      // if(req.body.role){req.body.role = admin}
      // else{req.body.role = false}

    }
  }

  let username = req.body.theUsername;
  let password = req.body.thePassword;

  let salt = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  User.create({
      username: username,
      password: hashPass,
      isAdmin: admin
    })
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      next(err);
    })
})


router.get('/login', (req, res, next) => {

  res.render('user/login');

})

router.post('/login', (req, res, next) => {
  let username = req.body.theUsername;
  let password = req.body.thePassword;

  User.findOne({
      'username': username
    })
    .then((userFromDB) => {
      if (!userFromDB) {

        // req.flash('error', 'Sorry, that username does not exist');

        res.redirect('/')
      }
      if (bcrypt.compareSync(password, userFromDB.password)) {
        req.session.currentuser = userFromDB; //magic line of code that logs you in
        res.redirect('/');
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => {
      next(err);
    })

})

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // can't access session here
    res.redirect("/user/login");
  });
});


router.get('/create-new-account', (req,res,next)=>{

  if(!req.user){
    req.flash('error', 'please log in to use this feature')
    res.redirect('/login')
  }

  if(!req.user.isAdmin){
    req.flash('error', 'you do not have access to this feature')
    res.redirect('/login')
  }

  res.render('user/creat-new-account')

})




router.get('/profile', (req,res,render)=>{
  res.render('user/profile')
})


router.post('/account/delete-my-account'),(req,res,next)=>{
  User.findByIdAndRemove(req.user._id)
  .then((result)=>{
    res.redirect('/login')
  })
  .catch((err)=>{
    next(err);
  })
}




module.exports = router;