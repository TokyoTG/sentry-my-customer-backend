var jwt = require('jsonwebtoken');
var config = process.env;

const verifyToken = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }
    
  jwt.verify(token, config.JWT_KEY, function(err, decoded) {
    if (err){
		  return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
	  };
    req.user = decoded;
    // console.log(req.user);
    next();
  });
}

module.exports = verifyToken;
