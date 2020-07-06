const Store = require("./../models/store");
const UserModel = require("../models/store_admin");

exports.createStore = async (req, res, next) => {
  if (
    req.body.store_name === "" || req.body.shop_address === "") {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
  try {
    const id = req.user.phone_number;
    const storeOwner = await UserModel.findOne({identifier: id});
    if (storeOwner) {
     storeOwner.stores.push({
       store_name: req.body.store_name,
       shop_address: req.body.shop_address
     })
     storeOwner.save().catch(error =>{
        res.send(error)
     }).then(store =>{
        res.status(201).json({
          success: true,
          message: "Store added successfully",
          data: {
            statusCode: 201,
            store: store
          }
        })
     })
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error:{

      }
    });
  }
};

exports.getAllStores = async (req, res, next) => {
  //current user's id to find user
  const id = req.user.phone_number;
  try {
    const store_admin = await UserModel.findOne({ identifier: id })
    if (!store_admin) {
      return res.status(404).json({
        status: "fail",
        message: "Something went wrong",
      });
    }else{
      let stores = store_admin.stores;
      res.status(200).json({
        status: "success",
        result: stores.length,
        message: "Here are all your stores",
        data: {
          statusCode: 200,
          stores
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: {

      }
    });
  }
};

exports.getStore = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;
    console.log(storeId);

    const store = await Store.findOne({ _id: storeId }).select("-__v");
    console.log(store);

    if (!store) {
      return res.status(404).json({
        status: "fail",
        message: "Store is not Found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        store,
      },
    });
  } catch (error) {
    res.status(200).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateStore = async (req, res, next) => {
  if (req.body.current_user === "" || (req.body.store_name == "" && req.body.shop_address == "")) {
    return res.status(500).json({
      status: false,
      message: "Current user or Store Name or Shop name required",
    });
  }
  try {
    const id = req.body.current_user;
    const storeOwner = await UserModel.findById(id);
    if (storeOwner) {
      const stores = storeOwner.stores.map(element => {
        if(element._id == req.params.store_id) {
          element.store_name = req.body.store_name || element.store_name,
          element.shop_address = req.body.shop_address || element.shop_address
        }
        return element
      });
     storeOwner.stores = stores
     storeOwner.save().catch(error =>{
        res.send(error)
     }).then(store =>{
        res.status(201).json({
          success: true,
          message: "Store updated successfully",
          data: {
            statusCode: 201,
            store: store
          }
        })
     })
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
        error:{
          statusCode: 404,
          message: "User not found",
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error:{

      }
    });
  }
};

exports.deleteStore = async (req, res, next) => {
  if (req.body.current_user === "") {
    return res.status(500).json({
      status: false,
      message: "Current user required",
    });
  }
  try {
    const id = req.body.current_user;
    const storeOwner = await UserModel.findById(id);
    if (storeOwner) {
      
      const stores = storeOwner.stores.filter(element => element._id != req.params.store_id);
      storeOwner.stores = stores
      storeOwner.save().catch(error =>{
        res.send(error)
      }).then(store =>{
        res.status(200).json({
          success: true,
          message: "Store deleted successfully",
          data: {
            statusCode: 200,
            store: store
          }
        })
     })
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
        error:{
          statusCode: 404,
          message: "User not found",
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error:{

      }
    });
  }
};
