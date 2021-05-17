const express=require('express');
const router=express.Router();
const crypto=require('crypto');
const GoogleOAuth=require('../GoogleOAuth2.0');

const credentials=require('../credentials.json');

const googleOAuth=new GoogleOAuth(credentials);

// GET /authorize/google
router.get('/google',(req,res)=>{
    const state=crypto.randomBytes(10).toString('hex');
    console.log(state);
    const redirectUrl=googleOAuth.generateRedirectUrl(state);
    console.log(redirectUrl);
    res.redirect(redirectUrl);
})

// GET /authorize/gmail/callback
router.get('/gmail/callback',(req,res)=>{
    // Google sends a error query string in case of error
    if(req.query.error){
        return res.status(401).send(req.query.error);
    }

    const stateReceived=req.query.state;
    const authCode=req.query.code;
    res.json({stateReceived,authCode});
})

module.exports=router;