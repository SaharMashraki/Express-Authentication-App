const mongoose= require("mongoose")

mongoose.connect("Mongodb_link")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})



const LogInCollection=new mongoose.model('LogInCollection',logInSchema)

module.exports=LogInCollection
