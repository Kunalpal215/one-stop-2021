const { userModel } = require("../models/onestopUserModel");

exports.createOnestopUser = async (req, res) => {
  console.log(req.body.email);
  console.log(req.body["email"]);
  console.log(req.body.name);
  console.log(req.body.deviceToken);
  if (!req.body.email || !req.body.name || !req.body.deviceToken) {
    res.json({
      success: false,
      message: "missing fields",
    });
  } else {
    try {
      let onestopuser = await userModel.findOne({"email" : req.body.email});
      console.log(onestopuser);
      if(onestopuser){
        if(!onestopuser.deviceTokens.includes(req.body.deviceToken)){
          onestopuser.deviceTokens.push(req.body.deviceToken);
        }
      }
      else{
        onestopuser = new userModel(req.body);
        onestopuser.deviceTokens.push(req.body.deviceToken);
      }
      await onestopuser.save();
      res.json({success: true,message: onestopuser.toString()});
    } catch (e) {
      console.log(e);
      res.json({
        success: false,
        message: e,
      });
    }
  }
};

exports.logoutUser = async (req, res) => {
  console.log(req.body);
  if (!req.body.email || !req.body.deviceToken) {
    res.json({
      success: false,
      message: "missing fields",
    });
  }
  else{
    try{
      let onestopuser = await userModel.findOne({"email" : req.body.email});
      console.log(onestopuser);
      if(onestopuser){
        if(!onestopuser.deviceTokens.includes(req.body.deviceToken)){
          var index = onestopuser.deviceTokens.indexOf(req.body.deviceToken);
          onestopuser.deviceTokens.splice(index, 1);
          await onestopuser.save();
          res.json({
            success: true,
            message: "Logout Successfully"
          });
        }
        else{
          res.status(400).json({
            success: false,
            message: "device token wrong"
          });
        }
      }
      else{
        res.status(400).json({
          success: false,
          message: "non user found"
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: e
      });
    }
  }
}
