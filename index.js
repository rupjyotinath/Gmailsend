const express=require('express');
const authRoutes=require('./routes/auth');
const session=require('express-session');

if(process.env.NODE_ENV!='produnction')
{
    require('dotenv').config()
}

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
}));

//ROUTES
app.use('/authorize',authRoutes);

// Handle 404
app.use('*',(req,res)=>{
    res.status(404).send("NOT FOUND");
})

app.listen(3000,()=>{
    console.log("SERVER LISTENING ON PORT 3000")
});