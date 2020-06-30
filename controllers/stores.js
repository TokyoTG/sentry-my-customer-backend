const Store = require("./../models/store");
const UserModel = require("../models/store_admin");

exports.createStore = async (req, res, next) => {
  console.log("here")
  if (
    req.body.store_name === "" || req.body.shop_address === "") {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
  try {
    const id = req.params.current_user;
    console.log(id)
    const storeOwner = await UserModel.findById(id);
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
  const id = req.params.current_user;
  try {
    const store_admin = await UserModel.findById(id)
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
  try {
    const store = await Store.findOneAndUpdate(req.params.store_id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        store,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteStore = async (req, res, next) => {
  console.log(req.params);

  try {
    const store = await Store.findOneAndRemove(
      req.params.store_Id,
      (error, data) => {
        if (error)
          res.status(404).json({
            status: "fail",
            message: error.message,
          });
      }
    );
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
