const mongoose = require("mongoose");
const foodItems = require("./foodItems");
var Scraper = require("images-scraper");

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageURL: {
    type: String,
    default: ''
  }
});

const foodOutletsSchema = new mongoose.Schema({
  outletName: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  closingTime: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true,
    min: [1000000000, "Invalid mobile number."],
    max: [9999999999, "Invalid mobile number."],
  },
  location: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  tags: [{
    type: String,
    required: true
  }],
  menu: [foodItemSchema],
  imageURL: {
    type: String,
    required: true
  }
});

foodOutletsSchema.pre('save',async function(){
  console.log(this.menu);
  for(let i=0;i<this.menu.length;i++){
    console.log(this.menu[i]);
    console.log(this.menu[i]["imageURL"]);
    console.log("here");
    if(this.menu[i]["imageURL"].length===0){
      const google = new Scraper({
        puppeteer: {
          headless: true,
        }
      });
      const imageResults = await google.scrape(this.menu[i]["name"],1);
      this.menu[i]["imageURL"] = imageResults[0]["url"];
      console.log(imageResults);
    }
  }
});

foodOutletsSchema.pre('findOneAndUpdate',async function(){
  for(let i=0;i<this["_update"]['$set']['menu'].length;i++){
    console.log(this["_update"]['$set']['menu']);
    console.log(this["_update"]['$set']['menu'][i]["imageURL"]);
    console.log("here");
    if(this["_update"]['$set']['menu'][i]["imageURL"].length===0){
      const google = new Scraper({
        puppeteer: {
          headless: true,
        }
      });
      const imageResults = await google.scrape(this["_update"]['$set']['menu'][i]["name"],1);
      this["_update"]['$set']['menu'][i]["imageURL"] = imageResults[0]["url"];
      console.log(imageResults);
    }
  }
});

const foodOutlets = mongoose.model("foodOutlet", foodOutletsSchema);

module.exports = foodOutlets;
