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
    // Save state parameter to session
    req.session.state=state;
    const redirectUrl=googleOAuth.generateRedirectUrl(state);
    console.log(redirectUrl);
    res.redirect(redirectUrl);
})

// GET /authorize/gmail/callback
router.get('/gmail/callback',async (req,res)=>{
    // Google sends a error query string in case of error
    if(req.query.error){
        return res.status(401).send(req.query.error);
    }

    const stateReceived=req.query.state;
    // Verify that received STATE is same
    if(stateReceived!=req.session.state){
        return res.status(400).send("Invalid Request")
    }
    console.log(req.session.state);

    const authCode=req.query.code;

    // GET ACCESS & REFRESH TOKEN
    try{
        const response=await googleOAuth.getToken(authCode);
        console.log(response.data);
    }
    catch(err){
        console.log(err);
    }
    
    res.json({stateReceived,authCode});
})

module.exports=router;