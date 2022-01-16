import { Auth } from "aws-amplify";
import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import EmployeeList from './EmployeeList';
import SearchBar from './SearchBar';

export const EmployeeContext = React.createContext();

class Home extends Component {

    constructor(props) {
        super(props); //number of emps :2

        this.state = {
            employees: props.employees, // 2 
            filteredResult: props.employees //2
        }
        this.handleSearch = this.handleSearch.bind(this);

        // Auth.currentSession()
        //     .then(session => {
        //         console.log(session.getAccessToken().getJwtToken());                
        //     })
        //     .catch(err => console.log("Not logged in"))
    }


    //lifecycle method which is called automatically after constructor or when props change
    static getDerivedStateFromProps(newProps, oldState) {
        if (newProps.employees.length != oldState.employees.length) {
            console.log("Props changed", newProps)
            return {
                employees: newProps.employees,
                filteredResult: newProps.employees
            }
        }
        return null;
    }

    async componentDidMount() {
        // let employees = await getEmployees()
        //     .catch(err => console.log("Error in loading employee data"));
        // this.setState({ employees, filteredResult: employees }); //equivalent to { employees:employees}
    }

    handleSearch(searchText) {
        if (searchText && searchText.length > 0) {
            searchText = searchText.toUpperCase();
            let filteredResult = this.state.employees.filter((item) => item.Name.toUpperCase().indexOf(searchText) >= 0 || item.Location.toUpperCase().indexOf(searchText) >= 0)
            this.setState({ filteredResult })
        } else {
            this.setState({ filteredResult: this.state.employees })
        }
    }

    render() {
        return <EmployeeContext.Provider value={{ employees: this.state.employees, data: this.state.filteredResult, doSearch: this.handleSearch }}>
            <Container>
                <Row>
                    <Col>
                        <h2>Home</h2>
                        <SearchBar />
                        <EmployeeList />
                    </Col>
                </Row>
            </Container>
        </EmployeeContext.Provider>
    }
}

//Map reduxstore state values to properties of component
function mapStateToProps(state) {
    return {
        //homecomponentPropetyName: stateValue
        employees: state.employeeState.employees
    }
}



export default connect(mapStateToProps, null)(Home);
