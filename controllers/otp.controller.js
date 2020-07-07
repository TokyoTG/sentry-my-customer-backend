const UserModel = require("../models/store_admin");
const OTP = require("../models/otp");
const africastalking = require("africastalking")({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME
});

exports.send = async (req, res) => {
  const identifier = req.user.phone_number;
  try {
    UserModel.findOne({ identifier })
      .then(async user => {
        console.log(user._id);
        let otp = await OTP.findOne({ user_ref_code: user._id });
        console.log(otp);
        if (otp) {
          otp.otp_code = makeid(6);
        } else {
          otp = new OTP({
            otp_code: makeid(6),
            user_ref_code: user._id
          });
        }
        console.log(otp);
        otp.save().then(result => {
          const sms = africastalking.SMS;
          sms
            .send({
              to: [`+${user.local.phone_number}`],
              message: `Your number verification to MyCustomer is ${result.otp_code}`
            })
            .then(response => {
              console.log(response);
              res.status(200).json({
                success: true,
                message: "successful",
                data: {
                  message: "successful"
                }
              });
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({
                success: false,
                message: "Something went wrong.",
                data: {
                  statusCode: 500,
                  error: "Something went wrong."
                }
              });
            });
        });
      })
      .catch(error => {
        res.status(500).json({
          status: false,
          message: error.message,
          error: {
            code: 500,
            message: error.message
          }
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      data: {
        statusCode: 500,
        error: err
      }
    });
  }
};

exports.verify = async (req, res) => {
  const identifier = req.user.phone_number;
  try {
    UserModel.findOne({ identifier })
      .then(async user => {
        let otp = await OTP.findOne({ _id: user._id });
        if (otp) {
          if (otp.otp_code == req.body.verify) {
            console.log("valid");
            user.local.is_active = 1;
            user
              .save()
              .then(response => {
                res.status(200).json({
                  success: true,
                  message: "successful",
                  data: {
                    message: "successful"
                  }
                });
              })
              .catch(error => {
                res.status(500).json({
                  status: false,
                  message: error.message,
                  error: {
                    code: 500,
                    message: error.message
                  }
                });
              });
          } else {
            res.status(404).json({
              status: false,
              message: "OTP invalid",
              error: {
                code: 404,
                message: "OTP invalid"
              }
            });
          }
        } else {
          res.status(404).json({
            status: false,
            message: "OTP not found",
            error: {
              code: 404,
              message: "OTP not found"
            }
          });
        }
      })
      .catch(error => {
        res.status(500).json({
          status: false,
          message: error.message,
          error: {
            code: 500,
            message: error.message
          }
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      data: {
        statusCode: 500,
        error: err
      }
    });
  }
};

function makeid(length) {
  //const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const characters = "0123456789";
  const charactersLength = characters.length;
  let result = "";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
