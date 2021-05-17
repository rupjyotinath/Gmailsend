const express=require('express');
const router=express.Router();
const fs=require('fs');
const path=require('path');
const gmail=require('../Gmail');

router.post('/send',async (req,res)=>{
    const apiKey=req.body.apiKey;
    const email=req.body.email;

    const To=req.body.To;
    const Subject=req.body.Subject;
    const Text=req.body.Text; // This the actual message of the email

    if(!apiKey){
        return res.status(400).send("API Key required");
    }
    if(!email){
        return res.status(400).send("email required");
    }
    if(!Text){
        return res.status(400).send("To field required");
    }
    if(!Subject){
        return res.status(400).send("Subject field required");
    }
    if(!To){
        return res.status(400).send("To field required");
    }

    // Read/Search the credentials file
    if(!fs.existsSync(path.join(__dirname,'../user_credentials/',`${apiKey}.json`))){
        return res.status(401).send("Invalid email or API Key")
    }
    try{
        const data=fs.readFileSync(path.join(__dirname,'../user_credentials/',`${apiKey}.json`));
        const tokensAndEmail=JSON.parse(data);
        // console.log(tokensAndEmail);
        
        // We need access_token
        const access_token=tokensAndEmail.access_token;

        // Generate the simple SIME message
        let message='';

        message+=`From: <${email}>\n`;
        message+=`To: <${To}>\n`;
        message+=`Subject: ${Subject}\n`;
        message+=`MIME-Version: 1.0\n`;
        message+=`\n`;
        message+=Text;

        // console.log(message);

        // Convert to base64
        const buff=Buffer.from(message);
        const base64Message=buff.toString('base64');
        console.log(base64Message)

        // Send 
        try{
            const response=await gmail.sendEmail(access_token,{
                "raw":base64Message
            });
            console.log(response.data)
            res.send("Successfully Send");
        }
        catch(error){
            // console.log(err);
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            } else if (error.request) {
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            //   console.log(error.config);
            res.status(500).send("Some Error while sending");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error")
    }

})

module.exports=router;