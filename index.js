const express=require('express');
const authRoutes=require('./routes/auth');

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//ROUTES
app.use('/authorize',authRoutes);

// Handle 404
app.use('*',(req,res)=>{
    res.status(404).send("NOT FOUND");
})

app.listen(3000,()=>{
    console.log("SERVER LISTENING ON PORT 3000")
});