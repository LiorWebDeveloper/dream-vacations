const express = require("express");
const app = express();
var multer = require("multer");
var path = require("path");
const io = require("socket.io").listen(4002);
const cors = require("cors");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const sequelize = require("./utils/database");
const Users = require("./models/usersModel");
const Vacation = require("./models/vacationsModel");
const Follows = require("./models/followsModel");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const UsersRoute = require("./routes/usersRoute");
app.use("/users", UsersRoute);

const VacationsRoute = require("./routes/vacationsRoute");
app.use("/vacations", VacationsRoute);

const FollowsRoute = require("./routes/followsRoute");
app.use("/follows", FollowsRoute);
app.use((req, res) => {
  res.send("Page NotFound");
});

/* from here it is all soket functions */
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("edit vacation", (vacation) => {
    io.sockets.emit("edit vacation", vacation);
  });

  socket.on("add vacation", (vacation) => {
    io.sockets.emit("add vacation", vacation);
  });

  socket.on("delete vacation", (vacation) => {
    io.sockets.emit("delete vacation", vacation);
  });

  // disconnect is fired when a client leaves the server
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

sequelize
  .sync()
  .then((result) => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log("error", "ERRR " + JSON.stringify(err));
  });
