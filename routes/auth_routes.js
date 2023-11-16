const express=require('express')
const passport=require('passport')
const router = express.Router()
const {login,logout,google,redirect,protected}=require("../controller/auth_controllers.js")
// router.route('/login').get(login)
router.route('/logout').get(logout)
router.route('/google' ).get( passport.authenticate('google',{
    scope:['profile']
}));
router.route('/google/redirect').get(passport.authenticate('google'), redirect)
router.route('/protected').get(protected)

module.exports=router