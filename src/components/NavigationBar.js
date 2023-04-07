import { Nav, Navbar, NavbarBrand, NavLink } from "react-bootstrap";
import { BsClipboard2Check, BsWrench } from "react-icons/bs";
import { MdManageAccounts, MdOutlineLogin, MdOutlineLogout, MdOutlineHome, MdOutlineForum } from "react-icons/md";
import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import logo from "./../images/logo192.png"
import { UserContext } from "./userContext";

const NavigationBar = () => {
    const { user, setUser } = useContext(UserContext)
    return (
        <Navbar collapseOnSelect expand="ms" bg="dark" variant="dark" style={{ padding: "15px" }}>

            <Navbar.Toggle aria-controls='navbarScroll' data-bs-target="#navbarScroll">
                <div className="navbar-item">
                    {
                        user ? (
                            <div style={{ color: "var(--bs-nav-link-color)", fontSize: 28 }}>
                                <img src={logo} width="auto" height="40" alt="random logo" />
                                    &emsp; AutoDiag
                            </div>
                        ) : (
                            <div style={{ color: "var(--bs-nav-link-color)", fontSize: 28 }}>
                                <img src={logo} width="auto" height="40" alt="random logo" />
                                    &emsp;AutoDiag
                            </div>
                        )
                    }
                </div>
            </Navbar.Toggle>
            <div className="ml-auto">
                {
                    user ? (
                        <div className="navbar-item" style={{fontSize:20, color: "rgb(255 255 255 / 55%)"}}>
                            {user.username}
                            <div style={{fontSize:12}}>
                            </div>
                        </div>
                    ) : (
                        <div className="navbar-item">
                            <NavLink eventKey="5" as={Link} style={{ fontSize:20, color: "rgb(255 255 255 / 55%)"}} to={`${process.env.PUBLIC_URL}/login`} href={`${process.env.PUBLIC_URL}/login`}>Sign in <MdOutlineLogin /></NavLink>
                        </div>
                    )
                }
            </div>
            <Navbar.Collapse id='navbarScroll'>
                <Nav className="flex-grow-1 justify-content-evenly" style={{ width: "100%", fontSize: 24 }}>
                    <NavbarBrand style={{ display: "flex" }}></NavbarBrand>
                    <hr style={{ height: "3px", border: "none", backgroundColor: "rgb(255 255 255 / 55%)", margin: "10px 0" }} />
                    <NavLink  eventKey="0" as={Link} to={`${process.env.PUBLIC_URL}/`} href={`${process.env.PUBLIC_URL}/`} style={{ display: "flex" }}><MdOutlineHome />&emsp;Home</NavLink>
                    <NavLink eventKey="1" as={Link} to={`${process.env.PUBLIC_URL}/diagnostics`} href={`${process.env.PUBLIC_URL}/diagnostics`} style={{ display: "flex" }}><BsWrench />&emsp;Diagnostics</NavLink>
                    <NavLink eventKey="2" as={Link} to={`${process.env.PUBLIC_URL}/maintenance`} href={`${process.env.PUBLIC_URL}/maintenance`} style={{ display: "flex" }}><BsClipboard2Check />&emsp;Maintenance</NavLink>
                    <NavLink eventKey="3" as={Link} to={`${process.env.PUBLIC_URL}/forums`} href={`${process.env.PUBLIC_URL}/forums`} style={{ display: "flex" }}><MdOutlineForum />&emsp;Forums</NavLink>
                    <div className="navbar-item">
                        {user ? (
                            <>
                                <NavLink eventKey="4" as={Link} to={`${process.env.PUBLIC_URL}/account`} href={`${process.env.PUBLIC_URL}/account`} style={{ display: "flex" }}><MdManageAccounts />&emsp;Account</NavLink>
                                <NavLink eventKey="6" as={Link} style={{ display: "flex" }} to={`${process.env.PUBLIC_URL}/login`} href={`${process.env.PUBLIC_URL}/login`} onClick={() => { setUser(null); localStorage.clear(); }}><MdOutlineLogout />&emsp;Logout</NavLink>
                            </>
                        ) : (
                            <div className="navbar-end">
                                <div className="navbar-item">
                                    <NavLink eventKey="5" as={Link} style={{ display: "flex" }} to={`${process.env.PUBLIC_URL}/login`} href={`${process.env.PUBLIC_URL}/login`}><MdOutlineLogin />&emsp;Sign in</NavLink>
                                </div>
                            </div>
                        )}
                    </div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavigationBar;