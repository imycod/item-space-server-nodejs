const authorizationCode = require("../models/authorizationCode.model");

exports.create = (req, res) => {
  // Validate request
  if (!req.body.code) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a authorization code
  const AuthorizationCode = {
    code: req.body.code,
    client_id: req.body.client_id,
    user_id: req.body.user_id,
    redirect_uri: req.body.redirect_uri,
    scope: req.body.scope,
  };

  // Save authorization code in the database
  authorizationCode
    .create(AuthorizationCode)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the authorization code.",
      });
    });
};
