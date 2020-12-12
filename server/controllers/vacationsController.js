const con = require("../utils/database");
const Vacations = require("../models/vacationsModel");
const Follows = require("../models/followsModel");

exports.addVacation = async (req, res) => {
  let files = req.files;
  let newVactionObj = {
    description: req.body.description,
    destination: req.body.destination,
    picture: files[0].filename,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    price: req.body.price,
  };
  await Vacations.create(newVactionObj)
    .then((result) => {
      res.send(result);
      console.log(result);
    })
    .catch((err) => {
      res.send(err);
    });
  res.send(files[0]);
};

exports.getAllVacations = async (req, res) => {
  let userId = req.query.userId;
  let vacations = [];
  let follows = [];
  await Vacations.findAll()
    .then((result) => {
      vacations = result;
    })
    .catch((err) => {
      res.send(err);
    });
  await Follows.findAll({ where: { userId: userId } })
    .then((result) => {
      follows = result;
      follows.map((follow) => {
        let index = vacations.findIndex(
          (vacation) => vacation.id === follow.vacationId
        );
        let vacationToPush = vacations[index];
        vacationToPush.dataValues.isFollow = true;
        vacations.splice(index, 1);
        vacations.unshift(vacationToPush);
      });
      res.send(vacations);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.getVacationsById = async (req, res) => {
  let id = req.query.id;
  await Vacations.findOne({ where: { id: id } })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.deleteVacation = async (req, res) => {
  let id = req.query.id;
  await Vacations.destroy({ where: { id: id } })
    .then((result) => {
      res.send("vacation delete");
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.updateVacation = async (req, res) => {
  let files = req.body.files;
  await Vacations.update(
    {
      description: req.body.description,
      destination: req.body.destination,
      picture: files[0].filename,
      fromDate: req.body.toDate,
      toDate: req.body.toDate,
      price: req.body.price,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  )
    .then((result) => {})
    .catch((err) => {
      res.send(err);
    });

  let vacations = [];
  await Vacations.findAll()
    .then((result) => {
      vacations = result;
    })
    .catch((err) => {
      res.send(err);
    });
  res.send(vacations);
};
