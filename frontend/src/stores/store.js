import axios from "axios";
import { applyMiddleware, createStore } from "redux";

const defaultState = {
}

const reducer = (state = defaultState, action) => {
    console.log(action);
    switch(action.type) {
        case "STORE_USER":
            return({
                ...state,
                user: {...action.data.User}
            });
        case "LOGOUT_USER":
            axios.get(`${process.env.BACKEND_URL}/logout`).then(res => {
                window.location.href = "/#/"
                window.location.reload();
            });
            let newState = {...state};
            delete newState.user;
            return(newState);
        case "TO_LOGIN":
            window.location = `/#/login`;
    }
}

let store = createStore(reducer, defaultState, window.devToolsExtension ? window.devToolsExtension() : f => f);
export default store;