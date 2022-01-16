import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Link, Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import { Container, Nav, Navbar } from 'react-bootstrap';
import EmployeeDetail from './components/EmployeeDetail';
import EmployeeForm from './components/EmployeeForm';
import { loadEmployees } from './actions/action-creators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//amplify
import { Amplify, Hub } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import { Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import LoginSuccess from './components/LoginSuccess';

Amplify.configure(awsExports);

function App({ loadEmployees }) {
    loadEmployees();


    // Auth.signIn(username, Password)
    //       .then(user => {
    //           console.log(user.signInUserSession.accessToken.jwtToken)
    //       });

    return (
        <Authenticator loginMechanisms={['username']}>
            {({ signOut, user }) => (
                <Router>
                    <Navbar bg="dark" variant="dark">
                        <Container>
                            <Navbar.Brand href="#home">{process.env.REACT_APP_APP_NAME}</Navbar.Brand>
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/" >Home</Nav.Link>
                                <Nav.Link as={Link} to="/about">About</Nav.Link>
                                <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                                <Nav.Link onClick={signOut}>Sign out</Nav.Link>
                                <Nav.Link href="#" > Welcome {user.username}</Nav.Link>
                            </Nav>
                        </Container>
                    </Navbar>
                    <div>
                        <Routes>
                            <Route exact path="/" element={<Home />}></Route>
                            <Route exact path="about" element={<About />}></Route>
                            <Route exact path="contact" element={<Contact />}></Route>
                            <Route exact path="employees/loc/:locId/ecode/:ecode" element={<EmployeeDetail />}></Route>
                            <Route exact path="employees/create" element={<EmployeeForm />} ></Route>
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </Router>
            )}
        </Authenticator>
    );
}


function mapDispatchToProps(dispatch) {
    let actionMap = {
        loadEmployees
    }
    return bindActionCreators(actionMap, dispatch);
}

export default connect(null, mapDispatchToProps)(App);
