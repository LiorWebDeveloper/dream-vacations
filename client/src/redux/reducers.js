

const initialState = {
    vacations: [],
    favoreits: [],
    loggedInUser: null,
    isAdmin: ''

};

function rootReducer(state = initialState, action) {
    /*     console.log("Root : ", action)
     */

    switch (action.type) {
        case 'SetVacation':
            state = { ...state, vacations: action.payload }
            break;
    }

    switch (action.type) {
        case 'SetUsers':
            state = { ...state, users: action.payload }
            break;
    }

    switch (action.type) {
        case 'SetFavoreits':
            state = { ...state, favoreits: action.payload }
            break;
    }

    switch (action.type) {
        case 'SetLoggedInUser':
            state = { ...state, loggedInUser: action.payload }
            break;
    }

    switch (action.type) {
        case 'setIfIsAdmin':
            state = { ...state, isAdmin: action.payload }
            break;
    }



    return state;
}
export default rootReducer;