const axios=require('axios');

function sendEmail(access_token,body){
    const config={
        "url":"https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        "method":"post",
        "responseType":'json',
        "headers":{"Content-Type":'application/json',"Authorization":`Bearer ${access_token}`},
    }
    config.data=body;

    return axios(config);
}

module.exports={
    sendEmail
}