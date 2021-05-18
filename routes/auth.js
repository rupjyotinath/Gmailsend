const express=require('express');
const router=express.Router();
const crypto=require('crypto');
const jwt=require('jsonwebtoken');
const fs=require('fs')
const path=require('path');
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
    // ALSO ID Token for email id
    try{
        const response=await googleOAuth.getToken(authCode);
        // console.log(response.data);

        // Decode the Id Token to get email
        const idToken=response.data.id_token;
        const decoded=jwt.decode(idToken);

        // Get email
        const emailId=decoded.email;
        console.log(emailId);

        // Will add an API key so only with API key, email sending request can be made to the API of this application
        const apiKey=crypto.randomBytes(12).toString('hex')

        // Save the tokens 
        // The file name would be apiKey itself , & will add email to the tokens
        const tokens=response.data;
        tokens.emailId=emailId;

        // Add the access_token expiry in epoch time seconds
        const currEpoch=Math.floor((new Date().getTime())/1000);
        const expiryTime=currEpoch+tokens.expires_in-5;  // 5 seconds random adjustment, not mandatory

        tokens.expiryTime=expiryTime;

        try{
            fs.writeFileSync(path.join(__dirname,'../user_credentials/',`${apiKey}.json`),JSON.stringify(tokens));
            return res.json({emailId,apiKey});
        }
        catch(err){
            console.log(err);
            return res.status(500).send("Internal Server Error: Unable to save credentials")
        }

    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error")
    }
})

module.exports=router;