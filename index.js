const mongoose=require('mongoose')


const connectdb=async ()=>{
    await mongoose.connect("mongodb://localhost:27017/college");
const productschema= new mongoose.Schema({
    name:String,
    year:String,
    college:String

})

    const product=mongoose.model('department',productschema);
    const data=await product.find();
    console.log(data);
}

connectdb();
