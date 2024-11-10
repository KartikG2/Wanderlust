const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type:String,
        required : true,
    },
    description : String,
    Image : {
        type : String,
        default:"https://media.istockphoto.com/id/476111648/photo/sunset-over-indian-ocean.jpg?s=1024x1024&w=is&k=20&c=FCiFLvocwhqLTAlQT-gNVh3Hj0TqLfc1gAEWRfJKnqg=",
        set : (v) => v===""?"https://media.istockphoto.com/id/476111648/photo/sunset-over-indian-ocean.jpg?s=1024x1024&w=is&k=20&c=FCiFLvocwhqLTAlQT-gNVh3Hj0TqLfc1gAEWRfJKnqg=" : v,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type:Schema.Types.ObjectId,
            ref : "Review",
        }
    ]
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
