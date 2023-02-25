import {Nav, Navbar, NavLink} from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "./../images/logo192.png"

const NavigationBar = () => {
    return (
        <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="navbarScroll" data-bs-target="#navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav className="justify-content-center" style={{width:"100%"}}>
                    <NavLink eventKey="1" as={Link} to={`${process.env.PUBLIC_URL}/`}>
                        <img
                            src={logo}
                            width = "auto"
                            height = "30"
                            alt="random logo"
                        />
                    </NavLink>
                    <NavLink eventKey="2" as={Link} to={`${process.env.PUBLIC_URL}/diagnostics`}>Diagnostics</NavLink>
                    <NavLink eventKey="3" as={Link} to={`${process.env.PUBLIC_URL}/maintenance`}>Maintenance</NavLink>
                    <NavLink eventKey="5" as={Link} to={`${process.env.PUBLIC_URL}/forums`}>Forums</NavLink>
                    <NavLink eventKey="4" as={Link} to={`${process.env.PUBLIC_URL}/login`}>Login</NavLink>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavigationBar;