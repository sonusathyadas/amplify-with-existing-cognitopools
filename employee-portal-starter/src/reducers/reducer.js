import { combineReducers } from "redux";
import employeeReducer from "./employee-reducer";

const rootReducer = combineReducers({
    employeeState: employeeReducer,
    //customerState:customerReducer
    //productState:productState
    //Add more reducers
});

export default rootReducer; 