const UserModel = require("../models/store_admin");
const bCrypt = require("bcryptjs");

module.exports = () => async (req, res) => {
  //  Input validation...
  const regex = /^(?=.*\d)(?=.*[a-z]).{6,20}$/;
  if (
    !req.body.oldPassword ||
    !req.body.newPassword ||
    !req.body.confirmPassword ||
    !req.body.newPassword.match(regex) ||
    req.body.newPassword !== req.body.confirmPassword
  ) {
    const oldPassword = req.body.oldPassword
        ? {}
        : { oldPassword: 'Path "oldPassword" is required' },
      confirmPassword = req.body.confirmPassword
        ? {}
        : { confirmPassword: 'Path "confirmPassword" is required' },
      newPassword = req.body.newPassword
        ? req.body.newPassword.match(regex)
          ? req.body.newPassword === req.body.confirmPassword
            ? {}
            : { message: "newPassword and confirmPassword must be equal" }
          : {
              message:
                "new password must be alphanumeric and 6-20 characters long.",
            }
        : { newPassword: 'Path "newPassword" is required' };
    return res.status(422).json({
      success: false,
      message: "Your request is missing required fields",
      error: {
        code: 422,
        errors: {
          ...oldPassword,
          ...confirmPassword,
          ...newPassword,
        },
      },
    });
  }

  const { phone_number: identifier } = req.user;
  try {
    const user = await UserModel.findOne({ identifier });
    const comparePasswords = await bCrypt.compare(
      req.body.oldPassword,
      user.local.password
    );
    if (!comparePasswords) {
      return res.status(401).json({
        status: false,
        message: "You provided an invalid old password",
        error: {},
      });
    }

    user.local.password = await bCrypt.hash(req.body.newPassword, 10);
    await user.save();
    return res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unexpected error occurred",
      error: {
        message: error.message,
        ...error,
      },
    });
  }
};
