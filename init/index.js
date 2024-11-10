const mongoose = require("mongoose");
const Listing = require("../models/listing");  //listing is a collection in terminal [[[[]]]] Listing is a collection in js
const initData = require("./data");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
main()
.then(()=>{console.log("connected to DB");
})
.catch(err => console.log(err));


const initDB = async ()=>{
 await Listing.deleteMany({});
 await Listing.insertMany(initData.data);
 console.log("Data was inititalized");
}

initDB();