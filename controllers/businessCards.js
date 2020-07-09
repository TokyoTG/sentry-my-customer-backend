const User = require("../models/user");
const UserStore = require("../models/user_store");

module.exports = () => async (req, res) => {
  try {
    const { user_role = null, phone_number = null } = req.user;

    //  Enable business card feature for only store admin
    if (!user_role || user_role !== "store_admin") {
      return res.status(403).json({
        message: "You can't access this resource",
        status: 403,
        user_role: req.user,
      });
    }

    const user = await User.findOne({ phone_number });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Please signin first", statsu: 401 });
    }

    //  Get all stores owned by user
    const userStore = await UserStore.find({ user_ref_id: user._id })
      .populate({ path: "store_ref_id" })
      .exec();

    //  Iterate through stores and create cards
    const data = userStore.map((store) => {
      const {
        store_name,
        Phone_number,
        email,
        shop_address,
      } = store.shop_ref_id;
      return {
        ownerName: `${user.first_name} ${user.last_name}`,
        storeName: store_name,
        email: email || user.email,
        phone: Phone_number || user.phone_number,
        storeAddress: shop_address,
      };
    });

    return res.status(200).json({
      message: "Your business cards:",
      data,
    });
  } catch (error) {
    //  Log error to console for maintenace by developers
    console.log({ ...error, errorStack: error.stack });

    //  Send server error response and optional dev if in dev mode
    res.status(500).json({
      message: "An unexpected error has occurred",
      status: 500,
      dev:
        process.env.NODE_ENV === "development"
          ? {
              ...error,
              errorStack: error.stack,
            }
          : null,
    });
  }
};
