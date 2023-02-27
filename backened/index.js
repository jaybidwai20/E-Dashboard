const express=require('express');
const cors=require("cors");
const app=express();
const User=require("./db/User")
const product2=require('./db/product')
const jwt=require('jsonwebtoken')
const jwtkey='ecomm'

require("./db/config")
app.use(cors());
app.use(express.json());

app.post("/register",async (req,res)=>{
    let user=new User(req.body);
    let result=await user.save();
    result=result.toObject();
    delete result.password;
    jwt.sign({result},jwtkey,{expiresIn:"2h"},(err,token)=>{
        if(err)
        {
            res.send("something went wrong please try again later");
        }
        res.send({result,auth:token});
    })
})

app.post("/login",async (req,res)=>{
    console.log(req.body);
    if(req.body.password&&req.body.email)
    {
   let user= await User.findOne(req.body).select("-password")
   if(user)
   {
    jwt.sign({user},jwtkey,{expiresIn:"2h"},(err,token)=>{
        if(err)
        {
            res.send("something went wrong please try again later");
        }
        res.send({user,auth:token});
    })
   }
   else{
    res.send({result:"No User Found"})
   }
}
})


app.post("/product",async (req,res)=>{    
let product3=new product2(req.body);
let ans=await product3.save();
res.send(ans);
})



app.get("/getdata",async(req,res)=>{
    const result= await product2.find();
    if(result.length>0)
    {
        res.send(result);
    }
    else
    {
        res.send({result2:"No products found "})
    }

})




app.delete("/product/:id",async(req,res)=>{
    const result= await product2.deleteOne({_id:req.params.id})
    res.send(result);
})


app.get("/update/:id",async (req,res)=>{
    const resp=await product2.findOne({_id:req.params.id});


if(resp)
{
    res.send(resp);
}
else{
    res.send({result:"data not found"});
}
})


app.put("/product/:id",async (req,res)=>{
    let resp=await product2.updateOne({_id:req.params.id},{$set:req.body});
    res.send(resp);
})

app.get("/search/:key",async (req,res)=>{
    let result= await product2.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {company:{$regex:req.params.key}},
            {category:{$regex:req.params.key}}


        ]
    })
    res.send(result);
})



app.listen(5000);