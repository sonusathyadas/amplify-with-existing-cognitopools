import { useContext, useRef } from "react";
import { Form, InputGroup, FormControl } from "react-bootstrap";
import { EmployeeContext } from "./Home";

export default function SearchBar( ) {

    const searchInput = useRef('');
    const { doSearch, data, employees} = useContext(EmployeeContext);

    return (
        <Form>
            <InputGroup className="mb-3">
                <InputGroup.Text id="search">Search</InputGroup.Text>
                <FormControl placeholder="Search by name or location" 
                ref={searchInput} 
                onChange={()=> doSearch(searchInput.current.value)} />
            </InputGroup>
            <p>Showing {data.length } of { employees.length } records </p>
        </Form>
    )
}