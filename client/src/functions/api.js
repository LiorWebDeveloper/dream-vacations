import Axios from "axios";
import Settings from "./settings";

let vacations = [];

/* this fun call to server send to server to get all vactions */
export const getAllVacation = async (userId) => {
  try {
    await Axios.get(
      `${Settings.GlobalURL}vacations/getAllVacations?userId=${userId}`
    ).then((response) => {
      // this.props.SetVacation(response.data);
      vacations = response.data;
    });
  } catch (e) {
    alert(
      "Sorry but you can not see vacations, there is a problem with the server"
    );
    console.log(e);
  }
  return vacations;
};

/* this fun call to server send to server to add a new vaction */
export const updateVacation = async (obj) => {
  await Axios.post(`${Settings.GlobalURL}vacations/updateVacation`, obj)
    .then((response) => {
      alert("The vacation was successfully update");
      vacations = response.data;
    })
    .catch((error) => {
      console.log("addVactionModal -> error", error);
      alert(
        "There is a problem with the server, the vacation was not added. Please try again later"
      );
    });
  return vacations;
};

/* this fun call to server send to server to add a new vaction */
export const callToServerAddVacation = async (obj) => {
  await Axios.post(`${Settings.GlobalURL}vacations/addVacation`, obj)
    .then((response) => {
      alert("The vacation was successfully added");
    })
    .catch((error) => {
      console.log("addVactionModal -> error", error);
      alert(
        "There is a problem with the server, the vacation was not added. Please try again later"
      );
    });
};

/* this fun is call to the server and  delete vacation  */
export const callToServerDeleteVacation = async (id) => {
  await Axios.get(`${Settings.GlobalURL}vacations/deleteVacation?id=${id}`)
    .then((response) => {
      alert("The vacation was successfully delete");
    })
    .catch((error) => {
      console.log("addVactionModal -> error", error);
      alert(
        "There is a problem with the server, the vacation was not added. Please try again later"
      );
    });
};

/* this fun call to server and inser vacation to follow */
export const callToServerAddOrDeleteFavoriteVacation = async (obj, url) => {
  await Axios.post(url, obj)
    .then((response) => {
      // this.getAllVacation();
    })
    .catch((error) => {
      console.log("addVactionModal -> error", error);
      alert(
        "There is a problem with the server, the vacation was not added. Please try again later"
      );
    });
};
