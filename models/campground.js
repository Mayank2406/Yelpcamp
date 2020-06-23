var mongoose =require("mongoose");

//SCHEMA SETUP:
                               
var campgroundSchema = new mongoose.Schema({
    name:String,
    price:String,
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"                  // Note that Comment is the model name in comment.js 
        }
    ]
});

module.exports =  mongoose.model("Campground",campgroundSchema);
                              // ^^ A plural version i.e campgrounds collection in DB will be saved.  
