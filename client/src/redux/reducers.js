const initialState = {
  vacations: [],
  loggedInUser: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "SetVacation":
      state = { ...state, vacations: action.payload };
      break;
  }

  switch (action.type) {
    case "SetLoggedInUser":
      state = { ...state, loggedInUser: action.payload };
      break;
  }
  return state;
}
export default rootReducer;
