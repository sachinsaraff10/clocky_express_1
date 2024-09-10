//  const { Int32 } = require('mongodb');
const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');

const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)?[a-z0-9-]+\.[a-z]{2,}\/?.*$/i;

const Website= mongoose.model('Website',
new mongoose.Schema({
    website:String,
    hours: {
      type:Number,
      required:true
    },
    minutes:{
      type:Number,
      required:true
    },
    seconds: {
      type: Number,
      required:true
    },

    owner: [{type: mongoose.Schema.Types.ObjectId,
      ref: 'User'}]
  
} 
))

const Sites= mongoose.model(
  'Sites'  ,new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId },
    // posts:[]

    }))

// module.exports= Website;
module.exports={Website,Sites};