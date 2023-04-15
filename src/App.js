import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { NavLink } from "react-bootstrap";
import NavigationBar from './components/NavigationBar';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Diagnostics from './components/Diag';
import Maintenance from './components/Maintenance';
import Forums from './components/Forums';
import PostPage from './components/PostPage'
import './App.css';
import { UserContext } from './components/userContext';
import AccountInfo from './components/AccountInfo';
import MainPage from './components/MainPage';
import { BsClipboard2Check, BsWrench } from "react-icons/bs";
import { MdManageAccounts, MdOutlineLogin, MdOutlineLogout, MdOutlineHome, MdOutlineForum } from "react-icons/md";
import MaintenanceNewJob from './components/MaintenanceNewJob';
import MaintenanceJob from './components/MaintenanceJob';


function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData !== null) {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    }
  }, [user]);

  // Add this useEffect to check if user data exists in local storage when the page refreshes
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setUser(userData);
      setToken(userData?.token);
    }
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{ user, setUser, token }}>
        <NavigationBar />
        <div style={{ paddingBottom: '200px', paddingTop: '50px' }}>
          <Routes>
            <Route exact path={`${process.env.PUBLIC_URL}/`} element={<MainPage />} />
            <Route exact path={`${process.env.PUBLIC_URL}/login`} element={<LoginPage />} />
            <Route exact path={`${process.env.PUBLIC_URL}/diagnostics`} element={<Diagnostics />} />
            <Route exact path={`${process.env.PUBLIC_URL}/maintenance`} element={<Maintenance />} />
            <Route exact path={`${process.env.PUBLIC_URL}/forums`} element={<Forums />} />
            <Route exact path={`${process.env.PUBLIC_URL}/register`} element={<RegistrationPage />} />
            <Route exact path={`${process.env.PUBLIC_URL}/account`} element={<AccountInfo />} />
            <Route exact path={`${process.env.PUBLIC_URL}/api/posts/:id`} element={<PostPage />} />
            <Route exact path={`${process.env.PUBLIC_URL}/api/maintenance/job/:id`} element={<MaintenanceJob />} />
            <Route exact path={`${process.env.PUBLIC_URL}/api/maintenance/job/new`} element={<MaintenanceNewJob />} />
          </Routes>
          <footer className="footer">               
            <p className="text-footer">
              <NavLink  eventkey="0" as={Link} to={`${process.env.PUBLIC_URL}/`} href={`${process.env.PUBLIC_URL}/`}><MdOutlineHome /></NavLink>
              <NavLink eventkey="1" as={Link} to={`${process.env.PUBLIC_URL}/diagnostics`} href={`${process.env.PUBLIC_URL}/diagnostics`}><BsWrench /></NavLink>
              <NavLink eventkey="2" as={Link} to={`${process.env.PUBLIC_URL}/maintenance`} href={`${process.env.PUBLIC_URL}/maintenance`}><BsClipboard2Check /></NavLink>
              <NavLink eventkey="3" as={Link} to={`${process.env.PUBLIC_URL}/forums`} href={`${process.env.PUBLIC_URL}/forums`}><MdOutlineForum /></NavLink>
              {user ? 
                (
                  <>
                    <NavLink eventkey="4" as={Link} to={`${process.env.PUBLIC_URL}/account`} href={`${process.env.PUBLIC_URL}/account`}><MdManageAccounts /></NavLink>
                    <NavLink eventkey="6" as={Link} to={`${process.env.PUBLIC_URL}/login`} href={`${process.env.PUBLIC_URL}/login`} onClick={() => { setUser(null); localStorage.clear();}}><MdOutlineLogout /></NavLink>
                  </>
                ) : 
                (
                    <NavLink eventkey="5" as={Link} to={`${process.env.PUBLIC_URL}/login`} href={`${process.env.PUBLIC_URL}/login`}><MdOutlineLogin /></NavLink>
                )
              }
            </p>
            <p style={{color:"rgb(255 255 255 / 55%)", display: "flex", justifyContent: "flex-end"}}>&copy; All rights reserved &emsp;</p>
          </footer>
        </div>
      </UserContext.Provider>
    </Router>
  )
}
export default App;