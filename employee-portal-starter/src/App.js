import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import { Container, Nav, Navbar } from 'react-bootstrap';
import EmployeeDetail from './components/EmployeeDetail';
import EmployeeForm from './components/EmployeeForm';
import { loadEmployees } from './actions/action-creators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

function App({ loadEmployees}) {
    loadEmployees();
    
    return (
        <Router>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">{process.env.REACT_APP_APPLICATION_NAME}</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div id="pagecontainer">
                <Routes>
                    <Route exact path="/" element={<Home />}></Route>
                    <Route exact path="/about" element={<About />} ></Route>
                    <Route exact path="/contact" element={<Contact />} ></Route>
                    <Route exact path="/employees/loc/:locId/ecode/:ecode" element={ <EmployeeDetail/> }></Route>
                    <Route exact path="/employees/create" element={ <EmployeeForm /> }></Route>
                </Routes>
            </div>
        </Router>
    );
}

function mapDispatchToProps(dispatch){
    let actionMap={
        loadEmployees
    }
    return bindActionCreators(actionMap,dispatch);
}

export default connect(null,mapDispatchToProps) (App);
