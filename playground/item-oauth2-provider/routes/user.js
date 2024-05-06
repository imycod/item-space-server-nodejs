'use strict';

const passport = require('passport');

const clientConfig = require("../config/clients");

module.exports.info = [
  passport.authenticate('bearer', { session: false }),
  (request, response) => {
    // request.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`. It is typically used to indicate scope of the token,
    // and used in access control checks. For illustrative purposes, this
    // example simply returns the scope in the response.
    response.json({ user_id: request.user.id, name: request.user.name, scope: request.authInfo.scope });
  }
];


module.exports.userStatus = (req,res) => {
  console.log('req.headers---',req.headers);

  const client_id = req.headers["client_id"];
  console.log('req.session----->',req.session);
  
  if (req.session && req.session.passport && req.session.passport.user) {
    res.send({ loggedIn: true, user: req.session.user, session: req.session });
  } else {
    // 用户未登录，返回206状态码和重定向的URL
    res.status(206);
    res.setHeader(
      "location",
      `http://localhost:3001/dialog/authorize?response_type=code&client_id=${clientConfig[client_id].client_id}&redirect_uri=${clientConfig[client_id].redirect_uri}`
    );

    res.end();
  }
};
