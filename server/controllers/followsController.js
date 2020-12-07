const con = require("../utils/database");
const Follows = require("../models/followsModel");
const Vacations = require("../models/vacationsModel");

exports.getAllFollows = async(req, res) => {
    let vacations = [];
    let followsArr = [];
    await Vacations.findAll().then((resulte) => {
        vacations = resulte;
    }).catch((err) => {
        res.send(err);
    });
    await Promise.all(vacations.map(async(vacation) => {
        await Follows.count({ where: { vacationId: vacation.id } }).then((result) => {
            if (result > 0) {
                let obj = {
                    vacationId: vacation.id,
                    followers: result
                };
                followsArr.push(obj);
            };
        }).catch((err) => {
            res.send(err);
        });
    }))
    res.send(followsArr);
}



exports.insertFollows = async(req, res) => {
    let FollowsObj = {
        userId: req.body.userId,
        vacationId: req.body.vacationId,
    };
    await Follows.count({
        where: { userId: FollowsObj.userId, vacationId: FollowsObj.vacationId },
    }).then((result) => {
        if (result == 0) {
            Follows.create(FollowsObj)
                .then((result) => {
                    res.send(result);
                })
                .catch((err) => {
                    res.send(err);
                })
                .catch((err) => {
                    res.send(err);
                });
        } else {
            res.send("vacationExists");
        }
    });
};

exports.deleteFollows = async(req, res) => {
    let userId = req.body.userId;
    let vacationId = req.body.vacationId;
    await Follows.destroy({ where: { userId: userId, vacationId: vacationId } })
        .then((result) => {
            res.send("Successfully deleted");
        })
        .catch((err) => {
            res.send(err);
        });
};