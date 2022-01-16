
import * as ActionTypes from './actions-types';
import axios from 'axios';

const API_URL = process.env.REACT_APP_EMPLOYEE_API_URL;

export function loadEmployees(){
    return async (dispatch)=>{
        try{
            let result = await axios.get(API_URL);
            dispatch({
                type:ActionTypes.GET_EMPLOYEES,
                payload: result.data
            })
            return Promise.resolve(result.data);
        }catch(ex){
            return Promise.reject(ex)
        }
    }
}

export function addEmployee(employee){
    return async(dispatch)=>{
        try{
            let result = await axios.post(API_URL,employee);//adding to database but not to inmemory state
            //update the state with dispatching an ADD_EMPLOYEE action
            dispatch({
                type:ActionTypes.ADD_EMPLOYEE,
                payload:employee
            })
            return Promise.resolve(result.data);
        }catch(err){
            return Promise.reject(err);
        }
    }
}

export function deleteEmployee(locId, eCode){
    return async(dispatch)=>{
        try{
            let url = `${API_URL}/location/${locId}/empcode/${eCode}`;
            let result = await axios.delete(url);
            dispatch({
                type:ActionTypes.DELETE_EMPLOYEE,
                payload:{locationId: locId, empCode:eCode}
            })
            return Promise.resolve(result.data);
        }catch(err){
            return Promise.reject(err);
        }
    }
}

export function getEmployee(locId,eCode){
    return async(dispatch)=>{
        try{
            let url = `${API_URL}/location/${locId}/empcode/${eCode}`;
            let result = await axios.get(url);
            dispatch({
                type:ActionTypes.GET_EMPLOYEE,
                payload: result.data
            })
            return Promise.resolve(result.data);
        }catch(ex){
            return Promise.reject(ex);
        }
    }
}


