const express = require('express');
const router = express.Router();

const User = require('../models/User')

// function checkIfAdmin() {
//     if (!req.user) {
//         req.flash('error', 'please log in to use this feature')
//         res.redirect('/login')
//     }

//     if (!req.user.isAdmin) {
//         req.flash('error', 'you do not have access to this feature')
//         res.redirect('/login')
//     }
// }

router.get('/create-new-account', (req, res, next) => {

    // checkIfAdmin();

    res.render('user/creat-new-account')


})

//finish this

// router.get('/active-users', (req, res, user) => {

//     // checkIfAdmin()

//     User.find()
//     .then((allUsers)=>{
//         res.render('user/')
//     })
//     .catch((err)=>{
//         next(err)
//     })

// })

//admin delete users
router.post('/delete/:id', (req, res, next) => {

    User.findByIdAndRemove(req.params.id)
        .then((result) => {

            req.flash('success', 'account successfully deleted')

            res.redirect('/active-users')
        })
        .catch((err) => {
            next(err);
        })
})


module.exports = router;