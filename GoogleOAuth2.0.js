const axios=require('axios');

class GoogleOAuth{
    constructor(credentials){
        this.client_id=credentials.web.client_id;
        this.auth_uri=credentials.web.auth_uri;
        this.token_uri=credentials.web.token_uri;
        this.client_secret=credentials.web.client_secret;
        this.callback_uri=credentials.web.redirect_uris[0];
    }

    generateRedirectUrl(state){
        console.log(this.callback_uri);
        const redirectUrl=this.auth_uri+'?'+"scope="+encodeURIComponent('https://www.googleapis.com/auth/gmail.send')+'+openid+email&access_type=offline&response_type=code&state='+state+'&redirect_uri='+encodeURIComponent(this.callback_uri)+'&client_id='+this.client_id;

        return redirectUrl;
    }

    getToken(code){
        const config={
            "url":this.token_uri,
            "method":'post',
            "responseType":'json',
            "headers":{"Content-Type":'application/json'},
            "data":{
                "code":code,
                "client_id":this.client_id,
                "client_secret":this.client_secret,
                "grant_type":"authorization_code",
                "redirect_uri":this.callback_uri
            }
        };

        // Returning a Promise
        return axios(config);
    }

    refreshToken(refresh_token){
        const config={
            "url":this.token_uri,
            "method":'post',
            "responseType":'json',
            "headers":{"Content-Type":'application/json'},
            "data":{
                "client_id":this.client_id,
                "client_secret":this.client_secret,
                "grant_type":"refresh_token",
                "refresh_token":refresh_token
            }
        };

        // Returning a Promise
        return axios(config);
    }
}

module.exports=GoogleOAuth;