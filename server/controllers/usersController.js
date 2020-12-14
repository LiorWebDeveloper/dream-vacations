const con = require("../utils/database");
const Users = require("../models/usersModel");

/* here we get object from the client to add a new user
we do check if the mail exsist and if not we send to DB insert a new user
*/
exports.insertUser = async (req, res) => {
  let obj = req.body;
  let mail = obj.mail;
  await Users.count({ where: { mail: mail } }).then((result) => {
    if (result == 0) {
      Users.create(obj)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      res.send("mailExists");
    }
  });
};

/* here we get mail and password from the client and do check if is correct in DB  */
exports.getUserByMail = async (req, res) => {
  let mail = req.body.mail;
  let password = req.body.password;
  await Users.findOne({ where: { mail: mail, password: password } })
    .then((result) => {
      if (result != null) {
        res.send(result);
      } else {
        res.send("incorrect");
      }
    })
    .catch((err) => {
      res.send(err);
    });
};
