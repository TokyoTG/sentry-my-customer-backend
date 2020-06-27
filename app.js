const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
require("dotenv").config();
const { MONGOLAB_URI, API_PORT } = process.env;
const app = express();

const ejs = require("ejs");
var cors = require("cors");
const documentation = require("./routes/documentation");
const customer = require("./routes/customer");
const phone_verification = require("./routes/verify-phone-number");
const example = require("./routes/example");
//const phone_call_api = require('./controllers/phone_call_api');
//require('./routes/transactions.js')(app);

const messagingAPI = require("./routes/messaging");
const mongoose = require("mongoose");
const transactions = require("./routes/transaction");
const store = require("./routes/stores.js");
const register = require("./routes/register_route");
const login = require("./routes/login_route");
const emailAPI = require("./routes/sendMail");
const complainRouter = require("./routes/complaint");

const docs = require("./routes/docs");
const user = require("./routes/user");
const businessCards = require("./routes/businessCardRoute");
const phone_call_api = require("./controllers/phone_call_api");
app.use(cors());
app.use(expressValidator());

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(MONGOLAB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.set("view engine", "ejs");

//Redirect to docs on get to root
app.get("/", (req, res) => {
  res.redirect("/docs");
});

app.use(documentation);
app.use(customer);
app.use(phone_verification);
app.use(messagingAPI);
app.use(emailAPI);
app.use(transactions);
app.use(businessCards);
app.use(store);
app.use(complainRouter);
app.use(user);
app.use(docs);
/**
 * phone call api route below
 *
 * A post request should  be made to localhost:5000/api/v1/call
 *
 */
app.use("/register", register);
app.use("/login", login);
//app.use('/api', phone_call_api);

app.use("/", phone_call_api);

//This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(400).json({
    message: "Page not found"
  });
});

const port = API_PORT || 5000;
app.listen(port, () => {
  console.log(`app running on port: ` + port);
});

require("dotenv").config();
