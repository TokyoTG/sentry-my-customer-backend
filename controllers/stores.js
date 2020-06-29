const Store = require("./../models/store");
const UserModel = require("../models/user");

exports.createStore = async (req, res, next) => {
  if (
    req.body.store_name === "" &&
    req.body.Phone_number === "" &&
    req.body.shop_address === "" &&
    req.body.tagline === ""
  ) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }

  try {
    const storeExists = await Store.findOne({
      store_name: req.body.store_name,
    });
    if (storeExists) {
      return res.status(404).json({
        status: "fail",
        message: "Store already exists",
      });
    }

    const store = await Store.create(req.body);
    store.__v = undefined;
    res.status(201).json({
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

exports.getAllStores = async (req, res, next) => {
  try {
    var { email } = req.user;
    let stores = await Store.find({email}).select("-__v");

    if (!stores) {
      return res.status(404).json({
        status: "fail",
        message: "Something went wrong",
      });
    }

    res.status(200).json({
      status: "success",
      result: stores.length,
      data: {
        stores,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
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
