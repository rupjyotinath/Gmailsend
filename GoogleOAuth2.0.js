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
        const redirectUrl=this.auth_uri+'?'+"scope="+encodeURIComponent('https://www.googleapis.com/auth/gmail.send')+'&access_type=offline&response_type=code&state='+state+'&redirect_uri='+encodeURIComponent(this.callback_uri)+'&client_id='+this.client_id;

        return redirectUrl;
    }
}

module.exports=GoogleOAuth;