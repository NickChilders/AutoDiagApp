import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Diagnostics from './components/Diag';
import Maintenance from './components/Maintenance';
import Forums from './components/Forums';
import cel from "./images/CEL.png";
import maint from "./images/Maint.png";
import './App.css';


function App() {
  return (
    <Router>
      <NavigationBar/>
      <div style={{paddingBottom: '200px', paddingTop: '50px'}}>
        <Routes>
          <Route exact path={`${process.env.PUBLIC_URL}/`} element={
            [
              <section className="section" key="section1">
                <div className="box-main">
                  <div className="firstHalf">
                    <h1 className="text-big" style={{marginTop:"20px"}}>
                      Welcome to AutoDiag!
                    </h1>
                    <p className="text-small">
                      You no longer need to be an expert to properly maintain and diagnose your car with confidence.
                    </p>
                    <Link to="/diagnostics">
                      <img
                          src={cel}
                          width = "auto"
                          height = "70"
                          alt="diagnostics link"
                      />
                    </Link>
                  </div>
                </div>
              </section>
            ,
              <section className="section" key="section2">
                <div className="box-main">
                  <div className="secondHalf">
                    <h1 className="text-big" id="program" style={{marginTop:"100px"}}>
                      Maintenance
                    </h1>
                    <p className="text-small">
                      No need to worry about finding the correct information. All necessary maintenance for YOUR car.
                    </p>
                    <Link to="/maintenance">
                      <img
                          src={maint}
                          width = "auto"
                          height = "100"
                          alt="maintenance link"
                      />
                    </Link>
                  </div>
                </div>
              </section>
            ,
              <section className="section" key="section3">
                <div className="box-main">
                  <div className="secondHalf">
                    <h1 className="text-big" id="program" style={{marginTop:"100px"}}>
                      Message Board
                    </h1>
                    <p className="text-small">
                      Browse the forums for everything related to YOUR car's year, make, and model.
                    </p>
                  </div>
                </div>
              </section>
            ,
            <section className="section" key="section4">
              <div className="box-main">
                <div className="secondHalf">
                  <h1 className="text-big" id="program" style={{marginTop:"100px"}}>
                    My Car
                  </h1>
                  <p className="text-small">
                    Track everything for your car. Year, Make, Model, Miles, MPG, etc.
                    All information needed to keep you and your car safe.
                    No more sifting through endless searches.
                  </p>
                </div>
              </div>
            </section>
            ]
          } />
          <Route exact path={`${process.env.PUBLIC_URL}/login`} element={<LoginPage />} />
          <Route exact path={`${process.env.PUBLIC_URL}/diagnostics`} element={<Diagnostics />} />
          <Route exact path={`${process.env.PUBLIC_URL}/maintenance`} element={<Maintenance />} />
          <Route exact path={`${process.env.PUBLIC_URL}/forums`} element={<Forums />} />
          <Route exact path={`${process.env.PUBLIC_URL}/register`} element={<RegistrationPage />} />
        </Routes>

        <footer className="footer" >
          <p className="text-footer">
            Copyright ©-All rights are reserved
          </p>
        </footer>
      </div>
      
    </Router>
  )
}
export default App;